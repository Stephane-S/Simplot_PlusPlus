from PyQt5.QtCore import QObject, pyqtSignal


class RunningStatus:
    """
    This class is used to manage the status of the app in relation with the analyses QThread() used by the SimPlot
    and Bootscanning analyses. If the GUI is closed during an analysis, the running variable will be switched
    to False and this value will be accessible by both the analysis_class and bootscan class and the workers to speed
    through the analysis and free the cpu cores.
    """
    def __init__(self):
        self.running = True

    def terminate(self):
        self.running = False

    def reset_status(self):
        self.running = True

    def get_status(self):
        return self.running