import sys
from cx_Freeze import setup, Executable

product_name = 'SimPlot++'

bdist_msi_options = {
    'upgrade_code': '{66620F3A-DC3A-11E2-B341-002219E9B01E}',
    'add_to_path': False,
    'initial_target_dir': r'[ProgramFilesFolder]\%s' % product_name
    }

# Dependencies are automatically detected, but it might need fine tuning.
# "packages": ["os"] is used as example only
build_exe_options = {"packages": ["os", "cogent3"], "excludes": [], "include_files": ["example_data"]}

# base="Win32GUI" should be used only for Windows GUI app
base = None
if sys.platform == "win32":
    base = "Win32GUI"

setup(
    name = "SimPlot++",
    version = "1.3",
    author = "Stephane Samson",
    description = "Recombination detection software",
    options = {'bdist_msi': bdist_msi_options,
               "build_exe": build_exe_options},
    executables = [Executable("main.py", base=base,
                              icon="SimPlot.ico",
                              targetName="SimPlot++.exe",
                              shortcut_name="SimPlot++",
                              shortcutDir="DesktopFolder")]
)