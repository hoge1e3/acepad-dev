import sys
#from importlib.abc import Loader, MetaPathFinder
from importlib.util import spec_from_loader
from types import ModuleType
from browser import window
def run(src):
    return exec(src)

class CustomLoader:
    def create_module(self, spec):
        return ModuleType(spec.name)

    def exec_module(self, module):
        src="""
#import foo.baa
custom_attribute = "This is a castamu module for 'foo'"
def bar():
    print("This! is the bar function from the foo module")
"""
        exec(src,module.__dict__)

class CustomImporter:
    def find_spec(self, fullname, path, target=None):
        print("custom",fullname,path,target)
        if fullname == "foo":
            return spec_from_loader(fullname, CustomLoader())
        return None


sys.meta_path.insert(0, CustomImporter())

window.use_brython(run)
