import sys
#from importlib.abc import Loader, MetaPathFinder
from importlib.util import spec_from_loader
from types import ModuleType
from browser import window
class VirtualFilesystemLoader:
    def __init__(self, virtual_fs, fullname, content):
        self.virtual_fs = virtual_fs
        self.fullname = fullname
        self.content = content

    def create_module(self, spec):
        return None

    def exec_module(self, module):
        exec(self.content, module.__dict__)

class VirtualFilesystemImporter:
    def __init__(self, virtual_fs):
        self.virtual_fs = virtual_fs
    def setRoot(self, f):
        self.virtual_fs=f
    def find_spec(self, fullname, path, target=None):
        parts = fullname.split('.')
        current = self.virtual_fs #sfile
        for i, part in enumerate(parts):
            #print(i,part)
            #if part in current and isinstance(current[part], dict):
            if current.rel(f"{part}/").exists():
                current = current.rel(f"{part}/")
            elif i == len(parts) - 1:
                f=current.rel(f"{part}.py")
                if f.exists():
                    return spec_from_loader(fullname, VirtualFilesystemLoader(self.virtual_fs, fullname, f.text()))
        # パッケージの場合
        init=current.rel("__init__.py")
        if init.exists():
            return spec_from_loader(fullname, VirtualFilesystemLoader(self.virtual_fs, fullname, init.text()), is_package=True)
        return None
"""class Py:
    def __init__(self):
        self.added=set()
    def addPath(self, d):
        if d.path() in self.added:
            return 
        self.added.add(d.path())
        sys.meta_path.insert(0, VirtualFilesystemImporter(d))
    def execFile(self, f):
        return exec(f.text())
"""
added=set()
def addPath(d):
    if d.path() in added:
        return 
    added.add(d.path())
    sys.meta_path.insert(0, VirtualFilesystemImporter(d))
def execFile(f):
    return exec(f.text())
window.onBrythonLoaded([addPath, execFile])
