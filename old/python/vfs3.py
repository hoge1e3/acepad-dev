import sys
#from importlib.abc import Loader, MetaPathFinder
from importlib.util import spec_from_loader
from types import ModuleType
from browser import window
fs=window.FS;
path1=fs.get("/jsmod/")
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
# 仮想ファイルシステムの定義
virtual_fs_old = {
    'mypackage': {
        '__init__.py': 'print("Initializing mypackage")\n',
        'module1.py': 'def func1():\n    print("This is func1 from module1")\n',
        'subpackage': {
            '__init__.py': 'print("Initializing mypackage.subpackage")\n',
            'module2.py': 'def func2():\n    print("This is func2 from subpackage.module2")\n'
        }
    }
}

# sys.meta_pathにVirtualFilesystemImporterを追加
sys.meta_path.insert(0, VirtualFilesystemImporter(path1))
window.exec=exec

def execf(f):
    return exec(f.text())
# 使用例
try:
    import mypackage
    #import mypackage.module1 as module1
    #from mypackage import module1
    #from mypackage.subpackage import module2

    #module1.func1()
    #module2.func2()
except ImportError as e:
    print(f"Import error: {e}")
"""
# 存在しないモジュールのインポートを試みる
try:
    import non_existent_module
except ImportError:
    print("Failed to import 'non_existent_module'")
"""