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

    def find_spec(self, fullname, path, target=None):
        parts = fullname.split('.')
        current = self.virtual_fs
        for i, part in enumerate(parts):
            #print(i,part)
            if part in current and isinstance(current[part], dict):
                current = current[part]
            elif i == len(parts) - 1:
                if part + '.py' in current:
                    return spec_from_loader(fullname, VirtualFilesystemLoader(self.virtual_fs, fullname, current[part + '.py']))
        # パッケージの場合
        if '__init__.py' in current:
            return spec_from_loader(fullname, VirtualFilesystemLoader(self.virtual_fs, fullname, current['__init__.py']), is_package=True)
        return None
# 仮想ファイルシステムの定義
virtual_fs = {
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
sys.meta_path.insert(0, VirtualFilesystemImporter(virtual_fs))
window.exec=exec


# 使用例
try:
    import mypackage
    import mypackage.module1 as module1
    #from mypackage import module1
    from mypackage.subpackage import module2

    module1.func1()
    module2.func2()
except ImportError as e:
    print(f"Import error: {e}")
"""
# 存在しないモジュールのインポートを試みる
try:
    import non_existent_module
except ImportError:
    print("Failed to import 'non_existent_module'")
"""