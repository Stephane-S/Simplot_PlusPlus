# doc : https://vimeo.com/47396346     for group_widget

import sys
from PyQt5 import QtWidgets, QtCore, QtGui #QtWebEngineWidgets
from PyQt5.Qt import *
from PyQt5.QtWidgets import QApplication, QMainWindow, QFileDialog, QMessageBox, QMenu, QStatusBar
from PyQt5.QtGui import QFontDatabase, QMouseEvent
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
from shutil import copyfile
from concurrent.futures import ProcessPoolExecutor
from multiprocessing import freeze_support

from tabulate import tabulate
import subprocess

import pathlib
import re
import ast
import os
import pickle
import psutil
import webbrowser
from PyQt5_gui.PyQT5_project.icons import icons_rc  # DO NOT REMOVE
from PyQt5_gui.file_info_dialog import Ui_Dialog

matplotlib.use("Qt5Agg")
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg, NavigationToolbar2QT as NavigationToolbar
from matplotlib.figure import Figure
from Bio import pairwise2 as pw2
from Bio.Nexus.Nexus import NexusError

# noinspection PyUnresolvedReferences
from PyQt5_gui import group_widget
# noinspection PyUnresolvedReferences
from PyQt5_gui.ui_main import Ui_MainWindow
# noinspection PyUnresolvedReferences
from PyQt5_gui.seq_window import Ui_Seq_window
# noinspection PyUnresolvedReferences
from PyQt5_gui.model_dialog import Ui_model_dialog
# noinspection PyUnresolvedReferences
from PyQt5_gui.bootscan_dialog import Ui_Dialog as Ui_bootscan_dialog
# noinspection PyUnresolvedReferences
from lib.Misc.groups_class import Groups
# noinspection PyUnresolvedReferences
from lib.SimPlot.analysis_class import SimplotAnalysis
# noinspection PyUnresolvedReferences
from lib.Misc.global_running import RunningStatus
# noinspection PyUnresolvedReferences
from PyQt5_gui import file_info_dialog
# noinspection PyUnresolvedReferences
from lib.Bootscan.bootscan import Bootscan_analysis
# noinspection PyUnresolvedReferences
from lib.FindSites.findsites import FindSitesAnalysis
# noinspection PyUnresolvedReferences
from lib.Misc.RGB_colors import get_RGB_list
# noinspection PyUnresolvedReferences
from lib.Misc.preferences import user_preferences
from lib.Network.network_analysis import NetworkAnalysis
from lib.Network.recombination_detection import RecombinationDetection
# noinspection PyUnresolvedReferences
from PyQt5_gui.simplot_settings_form import Ui_SimPlot_settings_form
from lib.SimPlot.quality_report import quality_report_generator
from PyQt5_gui.app_settings import Ui_UserPreferences as user_pref_dialog
from lib.recombination_tests.phipack_main import *
import lib.Network.Bokeh_graph_functions as Bgf


class MainWindow:
    def __init__(self):
        self.main_win = MyWindow()
        self.statusbar = QStatusBar()
        self.statuslabel = QLabel()
        self.statusbar.addPermanentWidget(self.statuslabel)
        self.main_win.setStatusBar(self.statusbar)
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self.main_win)
        self.seq_ui = Ui_Seq_window()
        #self.model_ui = Ui_model_dialog()
        self.model_ui = Ui_SimPlot_settings_form()
        self.bootscan_settings_ui = Ui_bootscan_dialog()
        self.app_settings = user_pref_dialog()
        self.groups = None
        self.analysis_instance = None
        self.groupNameDialog = None
        self.bootscan_instance = None
        self.bootscan_result_dict = None
        self.bootscan_refseq = None
        self.bootscan_settings = None
        self.simplot_result = None
        self.simplot_refseq = None
        self.network_settings = None
        self.network_instance = None
        #switch True if running outside the exe file to show network directly in GUI (optional)
        self.show_network_in_gui = False
        self.thread = None
        self.worker = None
        self.observer_thread = None
        self.observer_worker = None
        self.status = RunningStatus()

        self.disable_all_btn_before_browse()
        self.initial_cancel_btn_hide()
        self.user_pref = user_preferences()
        self.user_pref_dict = self.user_pref.load_user_pref()

        ### this section handles every button click on the mainwindow

        # switch to page 1
        self.ui.Btn_group_page.clicked.connect(lambda: self.go_to_group_page())
        # switch to page 2
        self.ui.Btn_simplot_page.clicked.connect(lambda: self.go_to_simplot_page())

        ### group page
        # browse files
        self.ui.Btn_File_Browser.clicked.connect(lambda: self.file_browser())
        # page 1 - add group to group list
        self.ui.Btn_add.clicked.connect(lambda: self.add_listWidget_groupwidget())
        # page 1 - del group
        self.ui.Btn_del.clicked.connect(lambda: self.del_listWidget_group())
        # page 1 - color dialog pushButton
        # self.btn_group_color.clicked.connect(lambda: self.select_group_color())
        # page 1 - save to nexus
        self.ui.Btn_save_nexus.clicked.connect(lambda: self.export_nexus())
        #page 1 - user preferences
        self.ui.Btn_user_pref.clicked.connect(lambda: self.user_pref_settings())
        # popup window seq
        #self.ui.listWidget_groups.itemDoubleClicked.connect(lambda: self.open_group_making_dialog())
        self.ui.listWidget_groups.currentItemChanged.connect(lambda: self.item_clicked())

        self.ui.Btn_all_to_free.clicked.connect(lambda: self.Btn_all_to_free_clicked())
        self.ui.Btn_all_to_group.clicked.connect(lambda: self.Btn_all_to_group_clicked())
        self.ui.Btn_to_free.clicked.connect(lambda: self.Btn_to_free_clicked())
        self.ui.Btn_to_group.clicked.connect(lambda: self.Btn_to_group_clicked())


        ### simplot page
        # launch simplot analysis
        self.ui.Btn_start_simplot.clicked.connect(lambda: self.launch_simplot())
        # launch simplot analysis
        self.ui.Btn_model_settings.clicked.connect(lambda: self.open_model_settings_dialog())
        # launch simplot in other window
        self.ui.Btn_plot_window.clicked.connect(lambda: self.plot_in_window())
        # refseq combobox simplot
        self.ui.comboBox_simplot_refseq.currentTextChanged.connect(lambda: self.simplot_change_refseq())
        #view quality report
        #self.ui.Btn_quality.clicked.connect(lambda: self.show_simplot_quality_report())
        self.ui.Btn_quality.clicked.connect(lambda: self.call_quality_report_generator())
        # cancel analysis
        self.ui.Btn_simplot_cancel.clicked.connect(lambda: self.stop_simplot())


        ### bootscan page
        # go to bootscan page
        self.ui.Btn_bootstrap_page.clicked.connect(lambda: self.go_to_bootscan_page())
        # launch bootscan
        self.ui.Btn_start_bootscan.clicked.connect(lambda: self.launch_bootscan_homemade())
        # launch plot in window
        self.ui.Btn_plot_window_bootscan.clicked.connect(lambda: self.plot_window_bootscan())
        # bootscan settings
        self.ui.Btn_bootscan_settings.clicked.connect(lambda: self.open_bootscan_dialog())
        # refseq combobox bootscan
        self.ui.comboBox_Bootscan_refseq.currentTextChanged.connect(lambda: self.bootscan_change_refseq())
        # cancel analysis
        self.ui.Btn_bootscan_cancel.clicked.connect(lambda: self.stop_bootscan())


        ### findsite page
        # go to Findsites page
        self.ui.Btn_findSites.clicked.connect(lambda: self.go_to_findSite_page())
        # findsite start button pressed
        self.ui.Btn_begin_findSites.clicked.connect(lambda: self.start_findSite_analysis())
        # findistes reset
        # self.ui.Btn_reset_findSite.clicked.connect(lambda: self.reset_findsite_result())
        # save findsite output
        self.ui.Btn_save_findSite.clicked.connect(lambda: self.save_findsite_output())


        ### network page
        # go to simplot network page
        self.ui.Btn_simplot_network.clicked.connect(lambda: self.go_to_sp_network_page())
        self.ui.Btn_start_sp_network.clicked.connect(lambda: self.start_network_analysis(dist_dict=None, launch=True))
        self.ui.Btn_network_settings.clicked.connect(lambda: self.open_model_settings_dialog())
        self.ui.Btn_save_html.clicked.connect(lambda: self.save_network_html())
        # cancel analysis
        self.ui.Btn_network_cancel.clicked.connect(lambda: self.stop_network())

        ### group page reopen feature
        # reopen feature inspired from https://www.youtube.com/watch?v=Aj-Q8pu_HG0
        reopen_menu = QMenu()
        self.ui.Btn_reopen.setMenu(reopen_menu)
        self.setup_reopen_menu(reopen_menu)
        reopen_menu.triggered.connect(lambda x: self.file_browser(reopen_path=x.text()))

        ### recombination test page
        self.ui.Btn_recombination_test.clicked.connect((lambda: self.go_to_recom_page()))
        self.ui.radioBtn_phi_test.toggled.connect(lambda: self.ui.recomb_stacked_pages.setCurrentWidget(self.ui.phi_test_option_page))
        self.ui.radioBtn_profile_test.toggled.connect(lambda: self.ui.recomb_stacked_pages.setCurrentWidget(self.ui.phi_profile_option_page))
        self.ui.Btn_start_recomb_test.clicked.connect(lambda: self.start_recombination_test())

        ### Help page
        self.ui.pushButton.clicked.connect(self.send_to_wiki)


    def go_to_group_page(self):
        if self.worker is None:
            self.ui.Pages_Widget.setCurrentWidget(self.ui.group_page)
        else:
            self.error_msg_box("The group page is not accessible while an analysis is running.")

    def change_status_label(self, string):
        self.statuslabel.setText(string)

    ####################################################
    # This section handles the cancel analysis feature #
    ####################################################
    def cancel_launch_btn_switch(self, analysis=None):
        if analysis == "simplot":
            self.ui.Btn_start_simplot.hide()
            self.ui.Btn_simplot_cancel.show()
        elif analysis == "bootscan":
            self.ui.Btn_start_bootscan.hide()
            self.ui.Btn_bootscan_cancel.show()
        elif analysis == "network":
            self.ui.Btn_start_sp_network.hide()
            self.ui.Btn_network_cancel.show()
        else:
            self.ui.Btn_start_simplot.show()
            self.ui.Btn_simplot_cancel.hide()
            self.ui.Btn_start_bootscan.show()
            self.ui.Btn_bootscan_cancel.hide()
            self.ui.Btn_start_sp_network.show()
            self.ui.Btn_network_cancel.hide()

        self.statuslabel.setText(f"")

    def initial_cancel_btn_hide(self):
        self.ui.Btn_simplot_cancel.hide()
        self.ui.Btn_bootscan_cancel.hide()
        self.ui.Btn_network_cancel.hide()

    ####################################################
    # This section handles the recombination test page #
    ####################################################

    def send_to_wiki(self):
        try:
            webbrowser.open('https://github.com/Stephane-S/Simplot_PlusPlus/wiki')
        except webbrowser.Error:
            self.error_msg_box("Failed to open a web page. Please visit https://github.com/Stephane-S/Simplot_PlusPlus/wiki for help.")
    ####################################################
    # This section handles the recombination test page #
    ####################################################

    def go_to_recom_page(self):
        self.ui.Pages_Widget.setCurrentWidget(self.ui.recombination_page)
        self.ui.recomb_stacked_pages.setCurrentWidget(self.ui.phi_test_option_page)
        self.ui.radioBtn_other.setHidden(True)  # functional but useless because of MSA requirements in group page

        if self.groups.get_datatype == "protein":
            self.ui.radioBtn_protein.click()
        else:
            self.ui.radioBtn_dna.click()

        group_count = 0
        if self.groups is not None:
            temp_dict = self.groups.return_groups_dict()
            for value_list in temp_dict.values():
                if len(value_list) > 0:
                    group_count += 1

        if group_count >= 2:
            self.ui.radioBtn_dist_recomb_test.setEnabled(True)
            self.ui.radioBtn_use_group_seqs.setEnabled(True)
        else:
            self.ui.radioBtn_dist_recomb_test.setEnabled(False)
            self.ui.radioBtn_use_group_seqs.setEnabled(False)

        phi_test_text = "PHI-test (Pairwise Homoplasy Index) is a recombination detection tool from PhiPack (1).\n" \
                        "Select your parameters and press start to start the analysis. \n\n" \
                        "- Permutations: Computes the Phi statistic of a direct permutation test\n" \
                        "- Window size: Size of the sliding window \n" \
                        "- NSS/Max Chi tests: Compute the Neighbour Similarity Score(2)  and the Maximum χ2 tests (3) as well as PHI" \
                        "\n\n\n" \
                        "1- Bruen, T. C., Philippe, H. et Bryant, D. (2006). A Simple and Robust" \
                        "   Statistical Test for Detecting the Presence of Recombination. Genetics," \
                        "   172(4), 2665–2681. http://dx.doi.org/10.1534/genetics.105.048975 \n\n" \
                        "2- Jakobsen, I. B. et Easteal, S. (1996). A program for calculating and" \
                        "   displaying compatibility matrices as an aid in determining reticulate" \
                        "   evolution in molecular sequences. Bioinformatics, 12(4), 291–295." \
                        "   http://dx.doi.org/10.1093/bioinformatics/12.4.291\n\n" \
                        "3- Smith, J. (1992). Analyzing the mosaic structure of genes. Journal of" \
                        "   Molecular Evolution, 34(2). http://dx.doi.org/10.1007/BF00182389"

        profile_text = "Phi Profile test is a Phi-test performed on a sliding window to further detect regions that exhibit evidence of mosaicism. \n" \
                       "Select your parameters and press start to start the analysis. \n\n" \
                        "- Permutations: Computes the Phi statistic of a direct permutation test\n" \
                        "- Window size: Size of the Phi analysis windows \n" \
                        "- Break window: Scanning size for regions to test \n" \
                        "- Step size: Moving step between sliding window analyses"

        distance_test = "This test detects sites of potential mosaicism based on the results of a distance proportion test\n" \
                        "- Samson et al. (2022). Un nouveau logiciel pour l'analyse de similarité entre les séquences" \
                        "   génétiques et son application à des données évolutives de SARS-CoV-2. Master's Thesis, Université du Québec à Montréal\n\n" \
                        "Simplot settings will be chosen when the start button is pressed."
        self.update_textedit_phitest_page(phi_test_text)
        self.ui.radioBtn_phi_test.clicked.connect(lambda: self.update_textedit_phitest_page(phi_test_text))
        self.ui.radioBtn_profile_test.clicked.connect(lambda: self.update_textedit_phitest_page(profile_text))
        self.ui.radioBtn_dist_recomb_test.clicked.connect(lambda: self.update_textedit_phitest_page(distance_test))

        # self.ui.radioBtn_phi_test.toggled.connect(lambda: self.ui.recomb_stacked_pages.setCurrentWidget(self.ui.phi_test_option_page))
        # self.ui.radioBtn_profile_test.toggled.connect(lambda: self.ui.recomb_stacked_pages.setCurrentWidget(self.ui.phi_profile_option_page))

    def update_textedit_phitest_page(self, text):
        self.ui.textEdit.clear()
        self.ui.textEdit.append(text)

    def onUpdateText(self, text):
        """Write console output to text widget."""
        cursor = self.ui.textEdit_2.textCursor()
        cursor.movePosition(QtGui.QTextCursor.End)
        cursor.insertText(text)
        self.ui.textEdit_2.setTextCursor(cursor)
        self.ui.textEdit_2.ensureCursorVisible()

    def closeEvent(self, event):
        """Shuts down application on close."""
        # Return stdout to defaults.
        sys.stdout = sys.__stdout__
        super().closeEvent(event)

    def write_recomb_output(self, str):
        self.ui.textEdit_2.append(str)

    def set_worker_to_none(self):
        self.worker = None

    def start_recombination_test(self):
        if self.worker is not None:
            self.error_msg_box("An analysis is already under way.")
            return

        self.ui.textEdit_2.clear()
        settings = self.get_recomb_settings()
        test_instance = PhiAnalyser(Q_output=True)
        test_instance.text_output.connect(self.write_recomb_output)
        # sys.stdout = Stream(newText=self.onUpdateText)

        if settings["test"] == "phi-test" or settings["test"] == "profile":
            # Step 2: Create a QThread object
            self.thread = QThread()
            # Step 3: Create a worker object
            self.worker = Worker_recomb(instance=test_instance, data=settings, textedit=self.ui.textEdit_2)
            # Step 4: Move worker to the thread
            self.worker.moveToThread(self.thread)
            # Step 5: Connect signals and slots
            self.thread.started.connect(self.worker.run)
            self.worker.finished.connect(self.thread.quit)
            self.worker.finished.connect(self.set_worker_to_none)
            self.worker.finished.connect(self.worker.deleteLater)
            self.thread.finished.connect(self.thread.deleteLater)
            # Step 6: Start the thread
            self.thread.start()
            self.worker.finished.connect(self.worker.deleteLater)
            self.thread.finished.connect(self.thread.deleteLater)

        if settings["test"] == "distance_recombination_test":
            filepath = self.groups.file_path
            filetype = self.groups.get_file_format()
            group_dict = self.groups.return_groups_dict()
            datatype = self.groups.get_datatype()
            progress_bar = self.ui.progressBar_global

            self.analysis_instance = SimplotAnalysis(filepath, filetype, datatype, group_dict,
                                                  self.user_pref_dict["consensus_threshold"], progress_bar, self.status)

            self.open_model_settings_dialog()
            self.launch_simplot(distance_recomb=True)

    def launch_distance_recomb(self, dist_dict):
        self.worker = None
        settings = self.get_recomb_settings()

        if dist_dict is not None:
            self.statuslabel.setText(f"Starting proportion test")
            sim_dict = self.calc_similarity()
            group_ids = self.groups.get_groups_id()
            recomb_instance = RecombinationDetection(dist_dict=dist_dict, global_sim_dict=sim_dict, group_ids=group_ids)
            result_df = recomb_instance.get_recombination_detect_results()
            # print(tabulate(result_df.head(10), headers='keys', tablefmt='psql', showindex=False, numalign="center"))
            tabulate.PRESERVE_WHITESPACE = True
            self.ui.textEdit_2.append(
                tabulate(result_df.head(10), headers='keys', tablefmt='html', showindex=False, numalign="center"))
            self.ui.progressBar_global.setValue(95)
            if settings["save_output"]:
                self.save_recombination_output()
            self.ui.progressBar_global.setValue(0)
        self.statuslabel.setText(f"")


    def save_recombination_output(self):
        temp_file = pathlib.Path("stored/recombination_output.txt")
        with open(temp_file, 'w') as f:
            f.write(str(self.ui.textEdit_2.toPlainText()))
        if temp_file.is_file():
            outpath = pathlib.Path(self.saveFileDialog() + ".txt")
            if outpath != "":
                outpath = outpath
                copyfile(temp_file, outpath)

    def get_recomb_settings(self):
        settings_dict = {}

        if self.ui.radioBtn_use_group_seqs.isChecked():
            self.save_consensus_fasta(recomb_test=True)
            default_path = pathlib.Path("stored/consensus_output.fasta")
            settings_dict["datafile"] = default_path
            settings_dict["datatype"] = "fasta"
        else:
            settings_dict["datafile"] = self.groups.get_file_path()
            settings_dict["datatype"] = self.groups.get_file_format()

        if self.ui.radioBtn_dna.isChecked():
            settings_dict["align_kind"] = "DNA"
        elif self.ui.radioBtn_protein.isChecked():
            settings_dict["align_kind"] = "Protein"
        else:
            settings_dict["align_kind"] = "Other"

        if self.ui.radioBtn_phi_test.isChecked():
            settings_dict["test"] = "phi-test"
            if self.ui.checkBox_phi_test_perm.isChecked():
                settings_dict["permutations"] = self.ui.spinBox_phi_test_perm.value()
            else:
                settings_dict["permutations"] = False

            settings_dict["window_size"]= self.ui.spinBox_phi_test_window.value()
            settings_dict["other_stats"] = self.ui.checkBox_phi_test_other_tests.isChecked()

        elif self.ui.radioBtn_profile_test.isChecked():
            settings_dict["test"] = "profile"
            if self.ui.checkBox_profile_perm.isChecked():
                settings_dict["permutations"] = self.ui.spinBox_profile_perms.value()
            else:
                settings_dict["permutations"] = False

            settings_dict["window_size"] = self.ui.spinBox_profile_window.value()
            settings_dict["break_window"] = self.ui.spinBox_profile_break_window.value()
            settings_dict["step"] = self.ui.spinBox_profile_step.value()

        else:
            settings_dict["test"] = "distance_recombination_test"

        settings_dict["multiproc"] = self.ui.checkBox_recomb_multiproc.isChecked()
        settings_dict["verbose"] = self.ui.checkBox_recomb_verbose.isChecked()
        settings_dict["save_output"] = self.ui.checkBox_recomb_save_output.isChecked()

        return settings_dict

    def calc_similarity(self, pairwise_align=False):
        dict = self.analysis_instance.get_consensus_dict()
        keys = list(dict.keys())
        sim_dict = {}
        for i in range(len(keys)):
            temp_dict = {}
            j = i + 1
            seq1 = dict[keys[i]]
            while j < len(keys):
                seq2 = dict[keys[j]]
                if pairwise_align is True:
                    global_align = pw2.align.globalxx(seq1, seq2)
                    seq_length = min(len(seq1), len(seq2))
                    matches = global_align[0][2]
                    percent_match = (matches / seq_length) * 100

                else:
                    percent_match = self.quick_similarity(seq1, seq2)

                temp_dict[keys[j]] = round(percent_match, 2)
                j += 1

            sim_dict[keys[i]] = temp_dict

        return sim_dict

    def quick_similarity(self, seq1, seq2):
        seq_length = min(len(seq1), len(seq2))
        score = 0
        for i in range(seq_length):
            if seq1[i] == seq2[i]:
                score += 1

        return (score / seq_length) * 100



    ################################################
    # This section handles the group making feature#
    ################################################

    def item_clicked(self):
        for index in range (self.ui.listWidget_groups.count()):
            item = self.ui.listWidget_groups.item(index)
            widget = self.ui.listWidget_groups.itemWidget(item)
            if widget is not None:
                widget.unclicked()

        try:
            index, item, widget, group_name = self.reach_group_widget()
        except AttributeError:
            # catches error when switching file while a group content is shown
            widget = None

        if widget is not None:
            widget.clicked()
            self.populate_selected_group_listwidget(widget, index)
        else:
            self.ui.label_6.setText("Select Group")
            self.ui.listWidget_selected_group.clear()

    def populate_selected_group_listwidget(self, widget, index):
        group_name = widget.get_group_name()
        self.ui.label_6.setText(group_name)
        self.add_seq_to_free_seq_listwidget()
        self.add_seq_to_selected_group_listwidget(index)

    def add_seq_to_free_seq_listwidget(self):
        self.ui.listWidget_free_seq.clear()
        seq_list = self.groups.get_ungrouped_seq()
        for seq in seq_list:
            self.ui.listWidget_free_seq.addItem(seq)

    def add_seq_to_selected_group_listwidget(self, index):
        self.ui.listWidget_selected_group.clear()
        group = self.get_group_name_listWidget_groups(index)
        bool = False
        try:
            seq_list = self.groups.get_seq_in_group(group)
            bool = True
        except KeyError as e:
            self.error_msg_box(f"Sequence could not be added to group: {group}")
        if bool:
            for seq in seq_list:
                self.ui.listWidget_selected_group.addItem(seq)

    def Btn_to_group_clicked(self):
        # get text(name) and index of every selected item and store in lists
        selected_items = [item.text() for item in self.ui.listWidget_free_seq.selectedItems()]
        selected_indexes = [index.row() for index in self.ui.listWidget_free_seq.selectedIndexes()]

        #reverse the indexes list so we remove the highest first later
        reversed_indexes = sorted(selected_indexes, reverse=True)
        #remove the items by their indexes
        for index in reversed_indexes:
            self.ui.listWidget_free_seq.takeItem(index)

        #add items to the selected group by their item name
        self.ui.listWidget_selected_group.addItems(selected_items)

        self.update_group_listwidgets()
        self.clear_analysis_outputs()

    def Btn_to_free_clicked(self):
        # get text(name) and index of every selected item and store in lists
        selected_items = [item.text() for item in self.ui.listWidget_selected_group.selectedItems()]
        selected_indexes = [index.row() for index in self.ui.listWidget_selected_group.selectedIndexes()]

        # reverse the indexes list so we remove the highest first later
        reversed_indexes = sorted(selected_indexes, reverse=True)
        #remove the items by their indexes
        for index in reversed_indexes:
            self.ui.listWidget_selected_group.takeItem(index)

        # add items to the free group by their item name
        self.ui.listWidget_free_seq.addItems(selected_items)
        self.update_group_listwidgets()
        self.clear_analysis_outputs()

    def Btn_all_to_free_clicked(self):
        while self.ui.listWidget_selected_group.count() > 0:
            self.ui.listWidget_free_seq.addItem(self.ui.listWidget_selected_group.takeItem(0))
        self.update_group_listwidgets()
        self.clear_analysis_outputs()

    def Btn_all_to_group_clicked(self):
        while self.ui.listWidget_free_seq.count() > 0:
            self.ui.listWidget_selected_group.addItem(self.ui.listWidget_free_seq.takeItem(0))
        self.update_group_listwidgets()
        self.clear_analysis_outputs()

    def update_group_listwidgets(self):
        index, item, widget, group_name = self.reach_group_widget()

        seq_list = []
        for i in range(self.ui.listWidget_selected_group.count()):
            item = self.ui.listWidget_selected_group.item(i)
            seq_list.append(item.text())

        try:
            self.groups.update_group(group_name, seq_list)
            self. modify_nbr_seq_label_listwidget(index, group_name)
        except KeyError as e:
            self.error_msg_box(f"Sequence could not be added to group: {group_name}")

    def modify_nbr_seq_label_listwidget(self, index, group_name):

        item = self.ui.listWidget_groups.item(index)
        widget = self.ui.listWidget_groups.itemWidget(item)
        nbr_seq = len(self.groups.get_seq_in_group(group_name))
        if nbr_seq < 2:
            widget.label_seq_length.setText(str(nbr_seq) + " sequence") #label_2
        else:
            widget.label_seq_length.setText(str(nbr_seq) + " sequences")

    def reach_group_widget(self):
        index = self.ui.listWidget_groups.currentRow()
        item = self.ui.listWidget_groups.item(index)
        widget = self.ui.listWidget_groups.itemWidget(item)
        if widget is not None:
            group_name = widget.get_group_name()
            return index, item, widget, group_name
        else:
            return None, None, None, None


    ############################################
    # This section handles the network analysis#
    ############################################

    def go_to_sp_network_page(self):
        self.ui.Btn_start_sp_network.setToolTip("The resulting graph will be shown in the default browser")
        if self.groups.check_if_empty_group(): # True if empty group
            self.error_msg_box("Empty group(s) detected")

        else:
            self.ui.Pages_Widget.setCurrentWidget(self.ui.network_page)
            filepath = self.groups.get_file_path()
            filetype = self.groups.get_file_format()
            datatype = self.groups.get_datatype()
            group_dict = self.groups.return_groups_dict()
            progress_bar = self.ui.progressBar_global
            self.analysis_instance = SimplotAnalysis(filepath, filetype, datatype, group_dict,self.user_pref_dict["consensus_threshold"], progress_bar, self.status)
            self.ui.progressBar_global.setValue(0)

    def clear_network_graph(self):
        while self.ui.Vlayout_network.count():
            child = self.ui.Vlayout_network.takeAt(0)
            if child.widget():
                child.widget().deleteLater()

    def start_network_analysis(self, dist_dict, launch=False):
        """
        network analysis relies on the simplot analysis for distance calculations. All dataframes are stored into the
        dist_dict variable in a {"refseq group" : df format}
        :return: no returns, output is sent directly to self.update_bokeh) graph for visualization
        """

        if launch:
            if self.worker is not None:
                self.error_msg_box("An analysis is already under way.")
                return
            else:
                self.network_instance = None
                self.clear_network_graph()
                self.launch_simplot(network_analysis=True)
        else:
            self.worker = None

        if dist_dict is not None:
            self.statuslabel.setText(f"Generating similarity network")
            group_dict = self.groups.return_groups_dict()
            consensus_dict = self.analysis_instance.get_consensus_dict()
            #self.analysis_instance

            # ## simplot settings
            model_settings_dict = self.analysis_instance.get_model_settings()
            step = model_settings_dict["step"]
            seq_length = self.analysis_instance.get_sequence_length()

            # dist_dict = self.launch_simplot(network_analysis=True)

            new_dist_dict = {}
            groups_id = self.groups.get_groups_id()
            for key, df in dist_dict.items():
                for key1, value1 in groups_id.items():
                    if value1 == key:
                        new_key = key1
                new_dist_dict[new_key] = self.rename_result_matrix(df)
            dist_dict = new_dist_dict

            if dist_dict is not None:
                self.network_instance = NetworkAnalysis(consensus_dict, group_dict, dist_dict, step)
                self.ui.progressBar_global.setValue(90)
                #get recombination df
                global_sim_dict = self.network_instance.get_global_sim_dict()
                recombination_instance = RecombinationDetection(dist_dict, global_sim_dict, groups_id)
                recombination_df = recombination_instance.get_recombination_detect_results()
                self.ui.progressBar_global.setValue(95)
                self.update_bokeh_graph(seq_length, step, model_settings_dict, recombination_df)
            else:
                self.error_msg_box("Computation failed. No output obtained.")

            self.ui.progressBar_global.setValue(0)

        self.statuslabel.setText("")

    def update_bokeh_graph(self, seq_length, step, model_settings_dict, recombination_df):
        """
        manages the network visualization through bokeh and creates an html file show in-app through the WebEngine View
        :param seq_length:
        :param step:
        :return: no returns
        """

        #Set to True to show network graph html page directly in GUI (unstable for creating executables because of QtWebEngine difficulties with <script> tags)
        #set to false to show in user web browser (recommended)

        if self.show_network_in_gui:
            pass
            print ("todo")
            # todo

            # if self.network_instance is not None:
            #     self.m_output = QtWebEngineWidgets.QWebEngineView()
            #
            #     group_colors = self.groups.get_groups_colors()
            #     graph_global_edge, graph_local_edge = self.network_instance.create_graph(seq_length, group_colors)
            #
            #     html_file = Bgf.plot_bokeh(graph_global_edge, graph_local_edge, seq_length, step, model_settings_dict, recombination_df)
            #
            #     self.clear_network_graph()
            #     self.ui.Vlayout_network.addWidget(self.m_output)
            #     page = WebEnginePage(self.m_output)  # class webenginepage required for download signals
            #     self.m_output.setPage(page)
            #     self.m_output.setHtml(html_file)
            #
            #     self.m_output.loadFinished.connect(self.on_loadFinished)

        else:
            if self.network_instance is not None:
                group_colors = self.groups.get_groups_colors()
                save_as_svg = self.user_pref_dict["network_svg"]
                try:
                    graph_global_edge, graph_local_edge = self.network_instance.create_graph(seq_length, group_colors)

                    html_file = Bgf.plot_bokeh(graph_global_edge, graph_local_edge, seq_length, step, model_settings_dict, recombination_df, save_as_svg)
                    self.clear_network_graph()
                    self.open_html_in_browser()
                except KeyError:
                    self.error_msg_box("Negative similarity values have forced the analysis to stop.\n"
                                       "You can try activating the SimPlot normalization option to solve the issue.\n"
                                       "This option is available in the User Preference section of the Groups page.")


    def open_html_in_browser(self):
        url = pathlib.Path("stored/network_output.html")
        try:  # should work on Windows
            os.startfile(url)
        except AttributeError:
            try:  # should work on MacOS and most linux versions
                subprocess.call(['open', url])
            except:
                self.error_msg_box("could not open in browser. You can save the HTML file and open it on your preferred browser.")


    def on_loadFinished(self, ok):
        if not ok:
            return
        w = None
        for child in self.m_output.findChildren(QtWidgets.QWidget):
            if (
                    child.metaObject().className()
                    == "QtWebEngineCore::RenderWidgetHostViewQtDelegateWidget"
            ):
                w = child
                break
        if w is not None:
            self.emulate_click(w, QtCore.QPoint(400, 200))

    def emulate_click(self, widget, pos):
        event_press = QMouseEvent(
            QtCore.QEvent.MouseButtonPress,
            pos,
            QtCore.Qt.LeftButton,
            QtCore.Qt.LeftButton,
            QtCore.Qt.NoModifier,
        )
        QtCore.QCoreApplication.postEvent(widget, event_press)
        event_release = QMouseEvent(
            QtCore.QEvent.MouseButtonRelease,
            pos,
            QtCore.Qt.LeftButton,
            QtCore.Qt.LeftButton,
            QtCore.Qt.NoModifier,
        )
        QtCore.QCoreApplication.postEvent(widget, event_release)

    def save_network_html(self):
        html_path = pathlib.Path("stored/network_output.html")
        if html_path.is_file():
            outpath = pathlib.Path(self.saveFileDialog() + ".html")
            if outpath != "":
                copyfile("stored/network_output.html", outpath)


    def setup_reopen_menu(self, menu): #todo move function to better place
        reopen_path = pathlib.Path("stored/reopen_path.pk")
        if not reopen_path.is_file():
            with open(reopen_path, 'wb') as file:
                #print ("pickle file created")
                pickle.dump([], file)
        path_list = self.read_pickled_list(reopen_path)
        if len(path_list) > 0:
            for item in path_list:
                action = menu.addAction(str(item))
                action.setIconVisibleInMenu(True)

    def stop_network(self):
        self.statuslabel.setText("Canceling running tasks")
        self.status.terminate()
        self.clear_network_graph()
        self.ui.progressBar_global.setValue(0)
        self.worker = None

    #############################################
    # This section handles the findsite feature #
    #############################################

    def save_findsite_output(self):
        temp_file = pathlib.Path("temp_findSite.txt")
        if temp_file.is_file():
            outpath = pathlib.Path(self.saveFileDialog() + ".txt")
            if outpath != "":
                outpath = outpath
                copyfile("temp_findSite.txt", outpath)

    def start_findSite_analysis(self):
        """
        Takes as input the 4 sequences chosen in the combobox and launch the findsite analysis
        :return: no returns but output text result to ui
        """
        query = self.ui.comboBox_query.currentText()
        ref1 = self.ui.comboBox_ref1.currentText()
        ref2 = self.ui.comboBox_ref2.currentText()
        outgroup = self.ui.comboBox_outgroup.currentText()

        filepath = self.groups.get_file_path()
        filetype = self.groups.get_file_format()

        if query != ref1 and query != ref2 and query != outgroup and ref1 != ref2 and ref1 != outgroup and ref2 != outgroup:
            FindSitesAnalysis(filepath, filetype, query, ref1, ref2, outgroup)

            output = open("temp_findSite.txt").read()
            self.ui.Btn_save_findSite.setEnabled(True)

            fixedfont = QFontDatabase.systemFont(QFontDatabase.FixedFont)
            fixedfont.setPointSize(12)  # same as notepad for ease of use and formatting
            self.ui.findSite_output_browser.setFont(fixedfont)
            self.ui.findSite_output_browser.setPlainText(output)

        else:
            self.error_msg_box("Cannot proceed with similar sequence IDS")

    def go_to_findSite_page(self):
        self.ui.Pages_Widget.setCurrentWidget(self.ui.findSites_page)
        self.populate_findsites_btn()
        self.ui.findSite_output_browser.clear()
        self.ui.Btn_save_findSite.setEnabled(False)

    #############################################
    # this section handles the bootscan feature #
    #############################################

    def go_to_bootscan_page(self):
        if self.groups.check_if_empty_group(): # True if empty group
            self.error_msg_box("Empty group(s) detected")

        # elif self.groups.get_datatype() == "protein":
        #     self.error_msg_box("This feature has not been implemented for AA sequences.")

        else:
            if self.bootscan_refseq is None:
                self.clear_bootstrap_canvas_layout()
            temp_dict = self.groups.return_groups_dict().copy()
            self.ui.Pages_Widget.setCurrentWidget(self.ui.bootscan_page)
            new_groups = self.groups.return_groups_dict()
            self.ui.progressBar_global.setValue(25)
            new_filepath = self.groups.file_path
            self.ui.progressBar_global.setValue(50)
            filetype = self.groups.get_file_format()
            self.ui.progressBar_global.setValue(60)

            self.bootscan_instance = Bootscan_analysis(new_filepath, filetype, new_groups, self.user_pref_dict["consensus_threshold"], self.status)
            self.ui.progressBar_global.setValue(90)
            # self.bootscan_instance = Bootscanning(new_filepath, filetype, new_groups, self.user_pref_dict["consensus_threshold"], progress_bar)

            self.groups.set_groups_dict(temp_dict)  # avoids the Bootstrap instance wiping the group_dict
            self.ui.progressBar_global.setValue(100)

            if self.bootscan_refseq is not None:
                self.populate_simplot_refseq_combobox(selected_refseq=self.bootscan_refseq)
            else:
                self.populate_bootscan_refseq_combobox()
            self.ui.progressBar_global.setValue(0)

    def launch_bootscan_homemade(self, plot_progress=True, show_window=False):
        """
        :param plot_progress: bool; show updated output every n loops if true
        :param show_window: output will not appear in the ui but in a popup instead
        :return: show output
        """
        if self.worker is not None:
            self.error_msg_box("An analysis is already under way.")
            return

        self.clear_bootstrap_canvas_layout()
        self.bootscan_result_dict = None
        refseq = self.ui.comboBox_Bootscan_refseq.currentText()
        self.bootscan_refseq = refseq
        settings_list = self.bootscan_instance.get_settings()
        window_length = settings_list[2]
        step = settings_list[3]
        seq_length = self.bootscan_instance.get_seq_length()
        iter = math.ceil((seq_length - window_length) / step)
        groups_colors_dict = self.groups.get_groups_colors().copy()
        groups_colors_dict.pop(refseq)
        refseq = refseq.replace(" ", "_")
        self.bootscan_instance.create_result_dict()
        self.ui.progressBar_global.setValue(5)

        key_list = ["bootstrap", "tree_model", "window_length", "step", "distance_model", "t_t", "refresh_rate", "multiproc"]
        settings_dict = dict(zip(key_list, settings_list))
        settings_dict["refseq"] = refseq
        settings_dict["seq_length"] = seq_length
        settings_dict["iter"] = iter
        settings_dict["groups_colors_dict"] = groups_colors_dict
        settings_dict["plot_progress"] = plot_progress
        settings_dict["nprocs"] = self.user_pref_dict["nprocs"]

        #######
        self.bootscan_canvas = MplCanvas(self, width=50, height=50, dpi=100)
        self.ui.verticalLayout_14.addWidget(self.bootscan_canvas)

        self.bootscan_canvas.axes.set_xlabel("Position", fontsize="12")
        self.bootscan_canvas.axes.set_ylabel("Similarity", fontsize="12")
        self.bootscan_canvas.axes.set_autoscaley_on(True)
        self.bootscan_canvas.axes.set_xlim(0, seq_length)
        self.bootscan_canvas.axes.grid()
        self.bootscan_canvas.draw()
        self.show()

        ###############
        # Step 2: Create a QThread object
        self.thread = QThread()
        # Step 3: Create a worker object
        self.worker = Worker_bootscan(instance=self.bootscan_instance, settings=settings_dict, canvas=self.bootscan_canvas, run_status=self.status, status_label=self.statuslabel)
        # Step 4: Move worker to the thread
        self.worker.moveToThread(self.thread)
        # Step 5: Connect signals and slots
        self.thread.started.connect(self.worker.run)
        self.worker.finished.connect(self.thread.quit)
        self.worker.finished.connect(self.worker.deleteLater)
        self.thread.finished.connect(self.thread.deleteLater)
        self.worker.return_result.connect(self.bootscan_finished)
        self.worker.process_stopped.connect(self.stop_bootscan)
        if show_window:
            self.worker.return_result.connect(self.plot_window_bootscan)
        self.worker.update_progress_bar.connect(self.update_progress_bar)
        self.worker.finished.connect(self.worker.deleteLater)
        self.thread.finished.connect(self.thread.deleteLater)
        self.thread.finished.connect(self.status.reset_status)
        self.thread.finished.connect(self.cancel_launch_btn_switch)
        self.thread.finished.connect(lambda: print("bootscan thread finished"))
        # Step 6: Start the thread
        self.thread.start()

        self.cancel_launch_btn_switch(analysis="bootscan")


    def bootscan_finished(self, dist_dict):
        self.worker = None
        self.bootscan_result_dict = dist_dict
        refseq = self.ui.comboBox_Bootscan_refseq.currentText()
        refseq = refseq.replace(" ", "_")

        if dist_dict is not None:
            result_matrix = dist_dict[refseq].drop(refseq, axis=0)
            self.create_bootstrap_canvas(result_matrix)
        else:
            self.error_msg_box("Computation failed. No output obtained.")

    def bootscan_change_refseq(self):
        """
        allows to switch the reference sequence without redoing the analysis
        :return:
        """
        if self.bootscan_result_dict is not None:
            refseq = self.ui.comboBox_Bootscan_refseq.currentText()
            refseq = refseq.replace(" ", "_")

            if self.bootscan_settings is not None:
                self.bootscan_instance.set_settings(self.bootscan_settings)

            result_matrix = self.bootscan_result_dict[refseq].drop(refseq, axis=0)
            result_matrix = self.rename_result_matrix(result_matrix)

            self.create_bootstrap_canvas(result_matrix)

    def create_bootstrap_canvas(self, dist_mat):
        """
        :param dist_mat: bootscan result, distance matrix
        :param settings_str: string of the user selected settings; will be shown under the plot
        :param refseq: selected reference sequence
        :param groups_colors_dict: user chosen group colors
        :return: show plot in the canvas
        """
        refseq = self.ui.comboBox_Bootscan_refseq.currentText()
        settings_list = self.bootscan_instance.get_settings()
        settings_str = f"Parameters - window: {settings_list[2]} bp, step: {settings_list[3]} bp, reps: {settings_list[0]}, {settings_list[4]}, T/t: {float(settings_list[5])}, {settings_list[1]}"
        groups_colors_dict = self.groups.get_groups_colors().copy()
        groups_colors_dict.pop(refseq)
        refseq = refseq.replace(" ", "_")
        x_gridlines = self.user_pref_dict["X_grid_lines"]
        y_gridlines = self.user_pref_dict["Y_grid_lines"]

        sc = MplCanvas(self, width=50, height=50, dpi=100)

        new_id_list = []
        id_dict = self.groups.get_groups_id()
        for row in dist_mat.index:
            new_id = None
            for key, value in id_dict.items():
                if value == row:
                    new_id = key
            if new_id is not None:
                new_id_list.append(new_id)
            else:
                new_id_list.append(row)
        dist_mat.index = new_id_list

        dist_mat.T.plot(ax=sc.axes, color=groups_colors_dict.values())
        sc.axes.set_xlabel("Position", fontsize="12")
        sc.axes.set_ylabel("% of Permuted Trees", fontsize="12")
        sc.axes.set_title(f"BootScan - Query: {refseq} \n {self.groups.get_file_path()}")
        self.clear_bootstrap_canvas_layout()
        toolbar = NavigationToolbar(sc, self.main_win)
        self.ui.verticalLayout_14.addWidget(toolbar)
        self.ui.verticalLayout_14.addWidget(sc)

        sc.axes.annotate(settings_str, xy=(0.5, 0), xycoords=('axes fraction', 'figure fraction'), xytext=(0, 10),
                         textcoords='offset points', size=11, ha='center', va='bottom', color="red")

        sc.axes.set_ylim([0, 105])
        if x_gridlines:
            sc.axes.grid(axis='x')
        if y_gridlines:
            sc.axes.grid(axis='y')
        hint = self.ui.top_bar.sizeHint()
        if hint.isValid():
            self.ui.top_bar.setMinimumSize(hint)

        sc.show()

    def clear_bootstrap_canvas_layout(self):
        while self.ui.verticalLayout_14.count():
            child = self.ui.verticalLayout_14.takeAt(0)
            if child.widget():
                child.widget().deleteLater()

    def plot_window_bootscan(self, dist_dict=None):
        """
        shows the bootscan plot in its own popup window on command
        Launches a bootscan analysis if no distance matrix exist
        :return:
        """
        if self.worker is not None:
            self.error_msg_box("An analysis is already under way.")
            return

        if dist_dict is not None:
            self.bootscan_result_dict = dist_dict

        if self.bootscan_result_dict is None:
            self.launch_bootscan_homemade(plot_progress=False, show_window=True)

        else:
            refseq = self.ui.comboBox_Bootscan_refseq.currentText()
            groups_colors_dict = self.groups.get_groups_colors().copy()
            groups_colors_dict.pop(refseq)
            refseq = refseq.replace(" ", "_")
            x_gridlines = self.user_pref_dict["X_grid_lines"]
            y_gridlines = self.user_pref_dict["Y_grid_lines"]

            result_matrix = self.bootscan_result_dict[refseq].drop(refseq, axis=0)
            result_matrix = self.rename_result_matrix(result_matrix)
            result_matrix.T.plot(color=groups_colors_dict.values())

            plt.xlabel("Position")
            plt.ylabel("Similarity")
            plt.title(f"SimPlot - Query: {refseq} \n {self.groups.get_file_path()}")
            if x_gridlines:
                plt.grid(axis='x')
            if y_gridlines:
                plt.grid(axis='y')
            #plt.text(90, -0.15, settings_str, color="r")  # todo optimize position

        plt.show()
        plt.show()

    def rename_result_matrix(self, dist_mat):
        new_id_list = []
        id_dict = self.groups.get_groups_id()
        for row in dist_mat.index:
            new_id = None
            for key, value in id_dict.items():
                if value == row:
                    new_id = key
            if new_id is not None:
                new_id_list.append(new_id)
            else:
                new_id_list.append(row)
        dist_mat.index = new_id_list

        return dist_mat

    def stop_bootscan(self):
        self.statuslabel.setText("Canceling running tasks")
        self.status.terminate()
        self.clear_bootstrap_canvas_layout()
        self.ui.progressBar_global.setValue(0)
        self.worker = None

    ############################################
    # this section handles the simplot feature #
    ############################################

    def go_to_simplot_page(self):

        if self.groups.check_if_empty_group(): # True if empty group
            self.error_msg_box("Empty group(s) detected")
        else:
            #self.simplot_result = None
            progress_bar = self.ui.progressBar_global

            if self.simplot_result is None:
                self.ui.Btn_quality.setEnabled(False)

            temp_dict = self.groups.return_groups_dict().copy()
            self.ui.Pages_Widget.setCurrentWidget(self.ui.simplot_page)
            self.clear_canvas_layout()

            if self.groups is not None:
                filepath = self.groups.file_path
                filetype = self.groups.get_file_format()
                group_dict = self.groups.return_groups_dict()
                datatype = self.groups.get_datatype()

                self.analysis_instance = SimplotAnalysis(filepath, filetype, datatype, group_dict, self.user_pref_dict["consensus_threshold"], progress_bar, self.status)

            self.groups.set_groups_dict(temp_dict)  # avoids the analysis instance wiping the group_dict
            if self.simplot_refseq is not None:
                self.populate_simplot_refseq_combobox(selected_refseq=self.simplot_refseq)
            else:
                self.populate_simplot_refseq_combobox()
            self.ui.progressBar_global.setValue(0)

    def calculate_all_start_pos(self, window_length, seq_length, step):
        start_pos = 0
        start_pos_list = []
        while start_pos + window_length < seq_length:
            start_pos_list.append(start_pos)
            start_pos += step

        return start_pos_list

    def launch_simplot(self, plot_progress=True, network_analysis=False, in_window=False, distance_recomb=False):
        if self.worker is not None:
            self.error_msg_box("An analysis is already under way.")
            return

        self.clear_canvas_layout()

        # grab required data before analysis
        model_settings_dict = self.analysis_instance.get_model_settings()
        window_length = model_settings_dict["window"]
        step = model_settings_dict["step"]
        refseq = self.ui.comboBox_simplot_refseq.currentText()
        if network_analysis is False:
            self.simplot_refseq = refseq
        seq_length = self.analysis_instance.get_sequence_length()
        if network_analysis is False and distance_recomb is False:
            groups_colors_dict = self.groups.get_groups_colors().copy()
            try:
                groups_colors_dict.pop(refseq)
            except KeyError as e:
                self.error_msg_box("No reference sequence selected")
                return
        else:
            groups_colors_dict = None
        refseq = refseq.replace(" ", "_")
        iter = math.ceil((seq_length - window_length) / step)
        strip_gap_error_list = []
        self.ui.progressBar_global.setValue(5)

        settings_dict = model_settings_dict.copy()
        settings_dict["refseq"] = refseq
        settings_dict["seq_length"] = seq_length
        settings_dict["iter"] = iter
        #settings_dict["strip_gap_error_list"] = strip_gap_error_list
        settings_dict["groups_colors_dict"] = groups_colors_dict
        settings_dict["plot_progress"] = plot_progress
        settings_dict["network_analysis"] = network_analysis
        settings_dict["distance_recomb"] = distance_recomb
        settings_dict["file_path"] = self.groups.get_file_path()
        settings_dict["normalize_simplot"] = self.user_pref_dict["normalize_simplot"]
        settings_dict["nprocs"] = self.user_pref_dict["nprocs"]

        # setup canvas for animated progress
        self.canvas = MplCanvas(self, width=50, height=50, dpi=100)
        self.ui.verticalLayout_10.addWidget(self.canvas)

        self.canvas.axes.set_xlabel("Position", fontsize="12")
        self.canvas.axes.set_ylabel("Similarity", fontsize="12")
        self.canvas.axes.set_autoscaley_on(True)
        self.canvas.axes.set_xlim(0, seq_length)
        self.canvas.axes.grid()
        self.canvas.draw()
        self.show()

        ###############
        # Step 2: Create a QThread object
        self.thread = QThread()
        # Step 3: Create a worker object
        self.worker = Worker_simplot(instance=self.analysis_instance, settings=settings_dict,
                                     output=self.simplot_result, canvas=self.canvas,
                                     run_status=self.status, status_label=self.statuslabel)
        # Step 4: Move worker to the thread
        self.worker.moveToThread(self.thread)
        # Step 5: Connect signals and slots
        self.thread.started.connect(self.worker.run)
        self.worker.finished.connect(self.thread.quit)
        self.worker.finished.connect(self.worker.deleteLater)
        self.thread.finished.connect(self.thread.deleteLater)
        if network_analysis:
            self.worker.return_result.connect(self.start_network_analysis)
            self.worker.process_stopped.connect(self.stop_network)
            self.cancel_launch_btn_switch(analysis="network")
        elif distance_recomb:
            self.worker.return_result.connect(self.launch_distance_recomb)
        else:
            self.worker.return_result.connect(self.simplot_launch_finished)
            self.worker.process_stopped.connect(self.stop_simplot)
            self.cancel_launch_btn_switch(analysis="simplot")
            if in_window:
                self.worker.return_result.connect(self.plot_in_window)
        self.worker.update_progress_bar.connect(self.update_progress_bar)
        self.worker.finished.connect(self.worker.deleteLater)
        self.thread.finished.connect(self.thread.deleteLater)
        self.thread.finished.connect(self.status.reset_status)
        self.thread.finished.connect(self.cancel_launch_btn_switch)
        # Step 6: Start the thread
        self.thread.start()


    def update_progress_bar(self, value):
        self.ui.progressBar_global.setValue(value)

    def simplot_launch_finished(self, dist_dict):
        self.worker = None
        self.simplot_result = dist_dict
        model_settings_dict = self.analysis_instance.get_model_settings()
        window_length = model_settings_dict["window"]
        step = model_settings_dict["step"]
        model = model_settings_dict["model"]
        refseq = self.ui.comboBox_simplot_refseq.currentText()
        groups_colors_dict = self.groups.get_groups_colors().copy()

        try:
            groups_colors_dict.pop(refseq)
            self.simplot_refseq = refseq
        except KeyError:
            if self.simplot_refseq != refseq:
                refseq = self.simplot_refseq
                groups_colors_dict.pop(refseq)
        except:
            refseq = list(groups_colors_dict.keys())[0]
            groups_colors_dict.pop(refseq)

        refseq = refseq.replace(" ", "_")

        settings_str = f"Parameters - window: {window_length} bp, step: {step} bp, model: {model}"
        if dist_dict is not None:
            self.create_Mpl_canvas(dist_dict[refseq], refseq, settings_str, groups_colors_dict)
        else:
            self.error_msg_box("Computation failed. No output obtained.")
        self.ui.Btn_quality.setEnabled(True)
        self.ui.progressBar_global.setValue(0)

        # dist_dict[refseq].to_csv("test_genome.csv", sep="\t")

        if self.user_pref_dict["auto_save_sp_qual"]:
            data_path = self.groups.get_file_path()  # pathlib object
            save_path = data_path.parents[0]
            timestr = time.strftime("%Y%m%d-%H.%M.%S")
            file_name = data_path.stem + "-quality" + timestr + ".html"
            save_path = save_path / file_name

            self.call_quality_report_generator(save_path)


    def call_quality_report_generator(self, save_path=None):
        self.create_distance_report()
        model_settings_dict = self.analysis_instance.get_model_settings()
        window_length = model_settings_dict["window"]
        step = model_settings_dict["step"]
        seq_length = self.analysis_instance.get_sequence_length()
        start_pos_list = self.calculate_all_start_pos(window_length, seq_length, step)

        gap_report_df, gap_threshold_df = self.analysis_instance.create_gap_report_df(start_pos_list)
        distance_report_df = self.create_distance_report()

        gap_threshold_df = self.rename_result_matrix(gap_threshold_df)
        gap_report_df = self.rename_result_matrix(gap_report_df)

        quality_report_generator(gap_report_df, gap_threshold_df, distance_report_df, save_path)

    def create_distance_report(self):
        dist_dict = self.simplot_result
        df = pd.DataFrame()

        id_dict = self.groups.get_groups_id()
        for key, sub_df in dist_dict.items():
            for new_key, value in id_dict.items():
                if value == key:
                    key = new_key

            sub_df = self.rename_result_matrix(sub_df)

            temp_df = sub_df.T
            temp_df.reset_index(inplace=True)
            temp_df = temp_df.rename(columns={"index": "position"})
            temp_df.position = temp_df.position.astype("str")
            temp_df = temp_df.set_index("position")
            temp_df.columns.name = "ids"
            stacked_temp_df = pd.DataFrame(temp_df.stack(dropna=False), columns=['similarity']).reset_index()
            stacked_temp_df.insert(1, 'refseq', key)

            df = df.append(stacked_temp_df, ignore_index=False)

            df['status'] = np.where(
                df['similarity'] >= 0, "distance calculated", np.where(
                    df['similarity'] == np.nan, "Not calculated",
                    np.where(df['similarity'] < 0, "Negative output", "Not calculated")))

        df = df.reset_index(drop= True)

        return df

    def create_Mpl_canvas(self, dist_mat, refseq, settings_str, group_colors_dict):
        """
        creates the ui canvas to show the plot output
        :param dist_mat: distance matric from simplot
        :param refseq: reference group
        :param settings_str: string of the user settings to be shown on the plot
        :param group_colors_dict: user selected group colors
        :return:
        """
        sc = MplCanvas(self, width=50, height=50, dpi=100)
        x_gridlines = self.user_pref_dict["X_grid_lines"]
        y_gridlines = self.user_pref_dict["Y_grid_lines"]

        dist_mat = self.rename_result_matrix(dist_mat)
        dist_mat.T.plot(ax=sc.axes, color=group_colors_dict.values())
        sc.axes.set_xlabel("Position", fontsize="12")
        sc.axes.set_ylabel("Similarity", fontsize="12")
        sc.axes.set_title(f"SimPlot - Query: {refseq} \n {self.groups.get_file_path()}")
        self.clear_canvas_layout()
        toolbar = NavigationToolbar(sc, self.main_win)
        self.ui.verticalLayout_10.addWidget(toolbar)
        self.ui.verticalLayout_10.addWidget(sc)
        sc.axes.annotate(settings_str, xy=(0.5, 0),xycoords=('axes fraction', 'figure fraction'), xytext=(0, 10),
                         textcoords='offset points', size=11, ha='center', va='bottom', color="blue")
        #sc.fig.subplots_adjust(left=0.08, bottom=0.1, top=0.9, right=0.93)
        sc.axes.set_autoscaley_on(True)

        if x_gridlines:
            sc.axes.grid(axis='x')
        if y_gridlines:
            sc.axes.grid(axis='y')

        hint = self.ui.top_bar.sizeHint()
        if hint.isValid():
            self.ui.top_bar.setMinimumSize(hint)

        sc.show()

    def clear_canvas_layout(self):
        while self.ui.verticalLayout_10.count():
            child = self.ui.verticalLayout_10.takeAt(0)
            if child.widget():
                child.widget().deleteLater()

    def plot_in_window(self, dist_dict=None):
        """
        show simplot output in a popup window; launch a simplot analysis if none exist
        :return:
        """
        if self.worker is not None:
            self.error_msg_box("An analysis is already under way.")
            return

        if dist_dict is not None:
            self.simplot_result = dist_dict

        if self.simplot_result is None:
            self.launch_simplot(plot_progress=False, in_window=True)

        else:
            model_settings_dict = self.analysis_instance.get_model_settings()
            refseq = self.ui.comboBox_simplot_refseq.currentText()
            groups_colors_dict = self.groups.get_groups_colors().copy()
            del groups_colors_dict[refseq]
            refseq = refseq.replace(" ", "_")
            x_gridlines = self.user_pref_dict["X_grid_lines"]
            y_gridlines = self.user_pref_dict["Y_grid_lines"]

            dist_mat = self.simplot_result[refseq]
            if refseq in dist_mat.index:
                dist_mat = dist_mat.drop(refseq, axis=0)
            dist_mat.T.plot(color=groups_colors_dict.values())
            plt.xlabel("Position")
            plt.ylabel("Similarity")
            plt.title(f"SimPlot - Query: {refseq} \n {self.groups.get_file_path()}")

            if x_gridlines:
                plt.grid(axis='x')
            if y_gridlines:
                plt.grid(axis='y')

            plt.show()

    def simplot_change_refseq(self):
        """
        allows to switch the reference sequence without redoing the analysis
        :return:
        """
        if self.simplot_result is not None:
            model_settings_dict = self.analysis_instance.get_model_settings()
            window_length = model_settings_dict["window"]
            step = model_settings_dict["step"]
            #refseq = model_settings_dict["refseq"]
            model = model_settings_dict["model"]

            refseq = self.ui.comboBox_simplot_refseq.currentText()

            groups_colors_dict = self.groups.get_groups_colors().copy()

            try:
                groups_colors_dict.pop(refseq)
                self.simplot_refseq = refseq
            except KeyError:
                if self.simplot_refseq != refseq:
                    refseq = self.simplot_refseq
                    groups_colors_dict.pop(refseq)
            except:
                refseq = list(groups_colors_dict.keys())[0]
                groups_colors_dict.pop(refseq)

            refseq = refseq.replace(" ", "_")

            settings_str = f"Parameters - window: {window_length} bp, step: {step} bp, model: {model}"
            self.create_Mpl_canvas(self.simplot_result[refseq], refseq, settings_str, groups_colors_dict)

    def save_simplot_result_to_csv(self):
        timestr = time.strftime("%Y%m%d-%H%M%S")
        temp_file_name = f"stored/simplot_output_{timestr}.csv"
        path = pathlib.Path(temp_file_name)

        outpath = pathlib.Path(self.saveFileDialog() + ".csv")

        if outpath != "":
            try:
                with open(outpath, 'w') as f:
                    for group, df in self.simplot_result.items():
                        f.write(f"reference sequence: {group}")
                        df.to_csv(f)
                        f.write("\n")
            except OSError as e:
                try:
                    with open(path, 'w') as f:
                        for group, df in self.simplot_result.items():
                            f.write(f"reference sequence: {group}")
                            df.to_csv(f)
                            f.write("\n")

                    self.error_msg_box(str(e) + f"\n\n your csv file is available here: \n {path}")
                except OSError:
                    self.error_msg_box(str(e) + "\n\n unable to write csv file.")

    def stop_simplot(self):
        self.statuslabel.setText("Canceling running tasks")
        self.status.terminate()
        self.clear_canvas_layout()
        self.ui.progressBar_global.setValue(0)
        self.worker = None

    #######################################
    # this section handles the group page #
    #######################################

    def clear_analysis_outputs(self):
        self.simplot_result = None
        self.simplot_refseq = None
        self.bootscan_instance = None
        self.bootscan_result_dict = None
        self.bootscan_refseq = None
        self.bootscan_settings = None

    def disable_all_btn_before_browse(self):
        #  assuming on page-1 (group page)
        self.ui.Btn_save_nexus.setEnabled(False)
        self.ui.Btn_simplot_page.setEnabled(False)
        self.ui.Btn_bootstrap_page.setEnabled(False)
        self.ui.Btn_add.setEnabled(False)
        self.ui.Btn_del.setEnabled(False)
        self.ui.Btn_findSites.setEnabled(False)
        self.ui.Btn_simplot_network.setEnabled(False)
        self.ui.Btn_to_group.setEnabled(False)
        self.ui.Btn_to_free.setEnabled(False)
        self.ui.Btn_all_to_group.setEnabled(False)
        self.ui.Btn_all_to_free.setEnabled(False)
        self.ui.Btn_recombination_test.setEnabled(False)

    def manage_btn_control(self):
        """
        restricts access to features if not enough groups have been chosen by the user
        """
        index = self.ui.listWidget_groups.count()
        self.clear_analysis_outputs()

        if index == 0:
            self.ui.Btn_add.setEnabled(True)
            self.ui.Btn_save_nexus.setEnabled(False)
            self.ui.Btn_simplot_page.setEnabled(False)
            self.ui.Btn_bootstrap_page.setEnabled(False)
            self.ui.Btn_del.setEnabled(False)
            self.ui.Btn_findSites.setEnabled(True)
            self.ui.Btn_to_group.setEnabled(False)
            self.ui.Btn_to_free.setEnabled(False)
            self.ui.Btn_all_to_group.setEnabled(False)
            self.ui.Btn_all_to_free.setEnabled(False)
            self.ui.Btn_recombination_test.setEnabled(True)
            self.ui.radioBtn_use_group_seqs.setEnabled(False)
            self.ui.radioBtn_dist_recomb_test.setEnabled(False)

        elif index == 1:
            self.ui.Btn_del.setEnabled(True)
            self.ui.Btn_to_group.setEnabled(True)
            self.ui.Btn_to_free.setEnabled(True)
            self.ui.Btn_all_to_group.setEnabled(True)
            self.ui.Btn_all_to_free.setEnabled(True)

            self.ui.Btn_save_nexus.setEnabled(False)
            self.ui.Btn_simplot_page.setEnabled(False)
            self.ui.Btn_simplot_network.setEnabled(False)
            self.ui.Btn_bootstrap_page.setEnabled(False)
            self.ui.radioBtn_use_group_seqs.setEnabled(False)
            self.ui.Btn_recombination_test.setEnabled(True)
            self.ui.radioBtn_dist_recomb_test.setEnabled(False)

        else:
            self.ui.Btn_simplot_page.setEnabled(True)
            self.ui.Btn_simplot_network.setEnabled(True)
            self.ui.Btn_bootstrap_page.setEnabled(True)
            self.ui.Btn_save_nexus.setEnabled(True)
            self.ui.Btn_findSites.setEnabled(True)
            self.ui.Btn_recombination_test.setEnabled(True)
            self.ui.radioBtn_use_group_seqs.setEnabled(True)
            self.ui.radioBtn_dist_recomb_test.setEnabled(True)

        if self.groups is not None:
            if self.groups.get_datatype() == "protein":
                self.ui.Btn_bootstrap_page.setEnabled(False)

    def open_file_info_dialog(self):
        """
        manual user input dialog for file format and datatype
        :return: the file format (fasta, nexus), datatype (dna, AA) and ok button pressed
        """
        dialog = QtWidgets.QDialog()
        dialog.ui = Ui_Dialog()
        dialog.ui.setupUi(dialog)
        dialog.exec_()
        if dialog.ui.buttonBox.accepted:
            file_format, datatype, okPressed = self.get_data_file_info_dialog(dialog.ui)

        else:
            okPressed = False
            file_format = None
            datatype = None

        return file_format, datatype, okPressed

    def get_data_file_info_dialog(self, dialog):
        file_format = dialog.comboBox_format.currentText()
        datatype = dialog.comboBox_datatype.currentText()
        return file_format, datatype, True

    def validate_alphabet(self, path, file_format):
        """
        :param path: user filepath
        :param file_format: ex: fasta, nexus
        :return: validation of expected characters
        """
        try:
            first_record = next(SeqIO.parse(path, file_format))
        except NexusError as e:
            self.error_msg_box(f"An error occured while loading the Nexus file with Biopython:\n"
                               f"{e}")
            return None
        except:
            self.error_msg_box(f"An unexpected error occured while loading the {file_format} file at {path}.")
            return None

        seq = str(first_record.seq)

        alphabets = {"dna": re.compile('^[acgtn-]*$', re.I),
                     "rna": re.compile('^[acgun-]*$', re.I),
                     "protein": re.compile('^[abcdefghijklmnopqrstuvwyzx*-]*$', re.I)}

        if alphabets["dna"].search(seq) is not None:
            return "DNA"
        elif alphabets["rna"].search(seq) is not None:
            return None
        elif alphabets["protein"].search(seq) is not None:
            return "protein"
        else:
            return None

    def detect_file_format(self, path_temp):
        path = pathlib.Path(path_temp)
        format_dict = {
            "fasta": [".fasta", ".fas", ".fa", ".seq", ".fsa", ".fna", ".ffn", ".faa", ".mpfa"],
            "nexus": [".nexus", ".nex", ".nxs"],
            "pir": [".nbrf", ".pir"],
            "phylip": [".phy", ".phylip"],
            "stockholm": [".sto", ".stk", ".stockholm"],
            "clustal": [".aln", ".clustal", ".clustalw"]
        }
        file_format = None
        for key, value in format_dict.items():
            if str(path.suffix) in value:
                file_format = key

        return file_format

    def saveFileDialog(self):
        fileName = QFileDialog.getSaveFileName()
        if fileName:
            return fileName[0]
        else:
            return ""

    def export_nexus(self):
        """
        get desired save path, converts file to nexus and call the groups saving function (self.add_groups_to_nexus)
        """
        output_file = str(self.saveFileDialog())
        if output_file != "":
            output_file = output_file + ".nexus"
            output_format = "nexus"
            input_file = self.groups.get_file_path()
            input_format = self.groups.get_file_format()
            datatype = self.groups.get_datatype()

            try:
                SeqIO.convert(input_file, input_format, output_file, output_format, molecule_type=datatype)
                self.add_groups_to_nexus(output_file)
            except ValueError as e:
                self.error_msg_box("An error occured while generating the group file:\n"
                                   f"{e}")

    def add_groups_to_nexus(self, output_file):
        """
        save data in nexus format and adds the groups section at the end that can be read when opening the file
        :param output_file: file to be saved
        """
        group_dict = self.groups.return_groups_dict()
        groups_color = self.groups.get_groups_colors()
        with open(output_file, "r") as f:  # read nexus file line by line and replace end signal to endblock
            lines = f.readlines()
        with open(output_file, "w") as f:
            for line in lines:
                if line.strip("\n") != "end;":
                    f.write(line)
                else:
                    f.write("endblock;")
        with open(output_file, "a") as f:  # append to nexus the group block and end; signal
            f.write("\nbegin SimPlot++ groups;")
            f.write("\n [!this block allows the SimPlot++ program to separate the ids into groups]\n")
            print("SimPlot++_groups:", group_dict, file=f)
            print("Groups_color:", groups_color, file=f)
            f.write("end;")
            #print("done!")

    def extract_nexus_groups(self):
        """
        extract ids, sequences and group colors from a nexus file
        :return: group exist(bool), sequence groups  and their colors
        """
        file_path = self.groups.get_file_path()
        group_exist = False
        group_colors = None
        group_dict = {}
        with open(file_path, "r") as f:
            for line in f:
                if "SimPlot++_groups:" in line:
                    group_exist = True
                    line = line.strip("SimPlot++_groups:")
                    line = line[1:]
                    group_dict = ast.literal_eval(line)

                    if not group_dict:  # if dict empty
                        group_exist = False

                if "Groups_color:" in line:
                    line = line.strip("Groups_color:")
                    line = line[1:]
                    group_colors = ast.literal_eval(line)
                    #print(group_colors)

        return group_exist, group_dict, group_colors

    def add_listWidget_groupwidget(self, name=None, color=None, from_nexus=False):
        """
        this function adds a groupwidget (visual representation of a group) in the group page listwidget
        :param name: group name (optional)
        :param color: group color (optional)
        :param from_nexus: bool
        :return:
        """
        index = self.ui.listWidget_groups.count()
        rgb_list = get_RGB_list()
        if name == None:
            name = "group_" + str(index)

        if color is None:
            if index <= len(rgb_list) - 1:
                color = rgb_list[index]
            else:
                # ex: index is 450 and len(rgb_list) is 104: 450 - (4*104) = 34  this gives infinite cycling across the list
                i = index - ((index // len(rgb_list)) * len(rgb_list))
                color = rgb_list[i]

        self.groups.add_group_color(name, color)
        item = QtWidgets.QListWidgetItem(self.ui.listWidget_groups)
        item_widget = group_widget.Ui_group_widget(name, self.groups, color)
        self.ui.listWidget_groups.addItem(item)
        self.ui.listWidget_groups.setItemWidget(item, item_widget)
        item.setSizeHint(item_widget.size())
        self.manage_btn_control()

        if not from_nexus:
            group_name = self.get_group_name_listWidget_groups(index)
            self.groups.add_group(group_name)

        else:
            self.groups.add_group(name)
            return index

        self.manage_btn_control()

    def del_listWidget_group(self):
        index = self.ui.listWidget_groups.currentRow()
        group_name = self.get_group_name_listWidget_groups(index)
        self.groups.remove_group(group_name)

        item = self.ui.listWidget_groups.selectedItems()
        for SelectedItem in self.ui.listWidget_groups.selectedItems():
            self.ui.listWidget_groups.takeItem(self.ui.listWidget_groups.row(SelectedItem))
        item = None

        self.manage_btn_control()

    def clear_group_listwidget(self):
        self.ui.listWidget_groups.clear()
        self.manage_btn_control()

    def check_if_new_path_in_list(self, new_path, list):
        """
        for pickling for the reopen feature on the group page
        :param new_path: path to be added to pickled list
        :param list: list of pickled path
        :return:
        """
        bool = False
        index = None
        #print("---- checking unique ----")
        for path in list:
            if new_path == path.resolve():
                bool = True
                index = list.index(path)
                #print("path already in reopen")
                break

        return bool, index

    def pickle_previous_file_paths(self, new_path):
        """
        pickled list of the 10 most recently opened data files in the app
        Pickling is used to save the data between sessions.
        :param new_path: opened path
        :return:
        """
        reopen_path = pathlib.Path("stored/reopen_path.pk")
        new_path = pathlib.Path(new_path)
        new_abs_path = new_path.resolve()

        old_list = self.read_pickled_list(reopen_path)
        bool, index = self.check_if_new_path_in_list(new_abs_path, old_list)  # return true if already in list

        if bool:
            del old_list[index]  # deleted so the index will be added to first position in list

        else:
            if len(old_list) == 10:
                del old_list[9]

            elif len(old_list) > 10:
                del old_list[9: len(old_list)]

        new_list = [new_abs_path] + old_list

        with open(reopen_path, "wb") as fi:
            pickle.dump(new_list, fi)
        #print("pickling:", new_list)

    def read_pickled_list(self, pickled_path):
        if pickled_path.is_file():
            #print("File exist")
            with open(pickled_path, 'rb') as fi:
                old_list = pickle.load(fi)

        else:
            #print("File not exist")
            old_list = []
        #print("read pickle:", len(old_list), old_list)

        return old_list

    def file_browser(self, reopen_path=None):
        """
        this function serves as the main function for opening, preprocessing and validating input data
        :param reopen_path: if path selected from the reopen feature
        :return:
        """
        if reopen_path is None:  # opens a dialog for user to choose the file to open if not chosen through reopen
            filename = QFileDialog.getOpenFileName()
            path = pathlib.Path(filename[0])
            okPressed = True
        else:
            path = pathlib.Path(reopen_path)
            okPressed = True

        if path.is_file() and os.path.getsize(path) > 0:  # validation that file exists and not empty
            self.clear_group_listwidget()
            self.ui.progressBar_global.setValue(5)

            file_format = self.detect_file_format(str(path))
            if file_format is None:
                # file_format, datatype, okPressed = self.open_file_info_dialog()  # manual input by user
                self.error_msg_box("The extension of the file selected is unknown to SimPlot++. \n"
                                   "Here is a list fo accepted extension: \n"
                                   "Fasta: .fasta, .fas, .fa, .seq, .fsa, .fna, .ffn, .faa, .mpfa \n"
                                   "Nexus: .nexus, .nex, .nxs\n"
                                   "Pir: .nbrf, .pir \n"
                                   "Stockholm: .sto, .stk, .stockholm \n"
                                   "Clustal: .aln, .clustal, .clustalw")
                self.ui.progressBar_global.setValue(0)
                return

            else:
                datatype = self.validate_alphabet(path, file_format)
                if datatype is None:
                    self.error_msg_box(
                        "The characters in the multiple sequence alignment did not match the expected alphabets.\n"
                        "SimPlot++ expect DNA or Protein sequences containing the following characters:\n"
                        "DNA: ACTGN-\n"
                        "Protein: ABCDEFGHIJKLMNOPQRSTUVWYZX*-")
                    self.ui.progressBar_global.setValue(0)
                    return

            self.ui.progressBar_global.setValue(25)
            if okPressed:  # will  be false only if user doesnt press 'ok' on manual datatype/fileformat input
                if self.check_no_empty_seq(path, file_format):
                    same_length = self.check_same_length(path, file_format)
                    if not same_length:
                        path, file_format = self.pad_seq_to_maxlen(path,
                                                                   file_format)  # creates "-" padded fasta copy of seq

                    detected_ambiguous_dict = self.check_ambiguous_characters(path, file_format, datatype)
                    if detected_ambiguous_dict and self.user_pref_dict[
                        "display_ambiguous_warning"]:  # only True if dict is not empty and user pref selected
                        self.info_msg_box(
                            "There are some ambiguous characters in your dataset. "
                            "\nThey will be replaced by \"-\" in the computation if still present after the "
                            "creation of the consensus sequences.", details=detected_ambiguous_dict, ambiguous=True)
                    self.ui.progressBar_global.setValue(50)
                    self.groups = Groups(path, file_format, datatype)
                    self.ui.progressBar_global.setValue(75)

                    if file_format == "nexus":
                        try:
                            self.update_groups_from_nexus_input()
                        except ValueError:
                            self.info_msg_box("Error loading the Nexus file.")
                            self.groups = None
                            self.clear_group_listwidget()
                            self.disable_all_btn_before_browse()
                            self.ui.progressBar_global.setValue(0)
                            return
                    if self.check_group_class_not_empty():
                        pass
                    else:
                        self.groups = None
                        # print("group not created")

            self.pickle_previous_file_paths(path)
            self.ui.progressBar_global.setValue(100)
            self.manage_btn_control()

            # populates the free_seq qlistwidget with ungrouped sequences for visual purposes
            for seq in self.groups.get_ungrouped_seq():
                self.ui.listWidget_free_seq.addItem(seq)

        else:
            self.error_msg_box("The selected file is either empty or doesnt exist")

        self.ui.progressBar_global.setValue(0)

    def check_ambiguous_characters(self, filepath, filetype, datatype):
        detected_dict = {}
        if datatype == "DNA":
            ambiguous = ["R", "Y", "K", "M", "S", "W", "B", "D", "H", "V", "N"]

        elif datatype == "protein":
            ambiguous = ["B", "J", "Z", "X", "*"]

        records = SeqIO.parse(filepath, filetype)
        for record in records:
            seq = str(record.seq.upper())
            detected_list = [char for char in seq if char in ambiguous]
            detected_list_counted = {}
            for i in detected_list:
                detected_list_counted[i] = detected_list_counted.get(i, 0) + 1

            if detected_list_counted: # empty dict is False
                detected_dict[record.id] = detected_list_counted

        return detected_dict


    def check_no_empty_seq(self, filepath, filetype):
        records = SeqIO.parse(filepath, filetype)
        no_empty_seq = True
        for record in records:  # append - to get same length on all sequences
            if len(record.seq) == 0:
                no_empty_seq = False
                self.error_msg_box(str(record.id) + " is an empty sequence")

        return no_empty_seq

    def check_same_length(self, filepath, filetype):
        same_length = True
        records = SeqIO.parse(filepath, filetype)
        records = list(records)  # make a copy, otherwise our generator
        # is exhausted after calculating maxlen
        maxlen = max(len(record.seq) for record in records)

        for record in records:  # append - to get same length on all sequences
            if len(record.seq) != maxlen:
                same_length = False

        return same_length  # false if all seq not same length

    def pad_seq_to_maxlen(self, filepath, filetype):
        """
        analysis requires that all sequences be the same length. - are added to the end of each sequence that are not
        the max length in the file and saved to a new fasta data file identifiable by _padded in the name
        :param filepath: user data file
        :param filetype: user file type dna or aa
        :return:
        """
        records = SeqIO.parse(filepath, filetype)
        records = list(records)  # make a copy, otherwise our generator is exhausted after calculating maxlen
        padding_details = {}  # used for info_popup box
        maxlen = max(len(record.seq) for record in records)

        for record in records:  # append - to get same length on all sequences
            if len(record.seq) != maxlen:
                padding_details[record.id] = str(maxlen - len(record.seq))
                sequence = str(record.seq).ljust(maxlen, '-')
                record.seq = Seq.Seq(sequence)
        assert all(len(record.seq) == maxlen for record in records)

        input_path = pathlib.Path(filepath)

        output_path = pathlib.Path(str(input_path.parent) + "/" + str(input_path.stem) + "_padded.fasta")
        with open(output_path, 'w') as f:
            SeqIO.write(records, f, 'fasta')
        self.info_msg_box("Due to unequal sequence length, one or more sequences have been padded. \n"
                          "The new padded file has been created here: \n" + str(output_path), padding_details, padding_info=True)
        return output_path, "fasta"

    def update_groups_from_nexus_input(self):
        """
        if nexus file used, this update the group class
        :return:
        """
        exist_bool, group_dict, group_colors = self.extract_nexus_groups()
        rgb_list = get_RGB_list()
        if exist_bool:  # true if a non-empty dict has been found
            i = 0  # counter for rgb_list
            for group_name, seq_list in group_dict.items():

                if group_colors is not None:
                    if group_name in group_colors.keys():
                        color = group_colors[group_name]
                else:
                    if i <= len(rgb_list) - 1:
                        color = rgb_list[i]
                    else:
                        i = 0
                        color = rgb_list[i]

                index = self.add_listWidget_groupwidget(group_name, color, from_nexus=True)
                self.groups.update_group(group_name, seq_list)
                self.groups.add_group_color(group_name, color)
                self.modify_nbr_seq_label_listwidget(index, group_name)

                i = i + 1

    def check_group_class_not_empty(self):
        if not self.groups.get_ungrouped_seq() and self.groups.seq_list == []:  # returns false if list is empty
            is_not_empty = False
        else:
            is_not_empty = True

        return is_not_empty

    def error_msg_box(self, error_msg):
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Warning)
        msg.setText(error_msg)
        # msg.setInformativeText("This is additional information")
        msg.setWindowTitle("Error")
        # msg.setDetailedText("The details are as follows:")
        msg.exec_()

    def info_msg_box(self, info_msg, details=None, strip_gap_error=False, padding_info=False, ambiguous=False):
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Information)
        msg.setText(info_msg)
        msg.setWindowTitle("Information")
        details_str = ""
        if details is not None and isinstance(details, dict) and padding_info is True:
            for seq_id, padding in details.items():
                line_str = f"Sequence ID: {seq_id} : {padding} - added \n"
                details_str += line_str
            msg.setDetailedText(details_str)

        if details is not None and isinstance(details, list) and strip_gap_error is True:
            for sublist in details:
                line_str = f"query: {sublist[0]},  group: {sublist[1]}, {sublist[2]}% of data points were not calculated\n"
                details_str = details_str + line_str
            msg.setDetailedText(details_str)

        if details is not None and ambiguous is True and isinstance(details, dict):
            for id, count_dict in details.items():
                line_str= f"Sequence id: {id} \n"
                for char, count in count_dict.items():
                    if count == 1:
                        count_term = "once"
                    elif count == 2:
                        count_term = "twice"
                    else:
                        count_term = str(count) + " times"
                    line_str = line_str + f"Character: {char}, detected {count_term}. \n"
                line_str = line_str + "-----" + "\n\n"
                details_str = details_str + line_str
            msg.setDetailedText(details_str)

        msg.exec()

    def get_group_name_listWidget_groups(self, index):
        item = self.ui.listWidget_groups.item(index)
        widget = self.ui.listWidget_groups.itemWidget(item)
        if widget is not None:
            if widget.lineEdit_group_name.text() != "":
                return widget.lineEdit_group_name.text()
            else:
                return widget.lineEdit_group_name.placeholderText()


    def open_bootscan_dialog(self):
        dialog = QtWidgets.QDialog()
        dialog.setWindowFlags(Qt.WindowCloseButtonHint)
        self.bootscan_settings_ui.setupUi(dialog)
        self.fill_bootscan_settings_dialog()
        self.bootscan_settings_ui.doubleSpinBox_t_t.setHidden(True)
        self.bootscan_settings_ui.label_6.setHidden(True)

        self.bootscan_settings_ui.buttonBox.accepted.connect(lambda: self.update_bootscan_settings())
        dialog.exec_()

    ####################################################
    ## this section handles user preferences settings ##
    ####################################################

    def user_pref_settings(self):
        dialog = QtWidgets.QDialog()
        dialog.setWindowFlags(Qt.WindowCloseButtonHint)
        self.app_settings.setupUi(dialog)

        self.setup_user_pref_settings()

        self.app_settings.buttonBox.accepted.connect(lambda: self.save_user_pref())
        self.app_settings.pushbtn_dwld_consensus.clicked.connect(lambda: self.save_consensus_fasta())

        dialog.exec_()

    def setup_user_pref_settings(self):
        # user_pref_dict = {"display_ambiguous_warning": True,
        #                   "auto_save_sp_qual": False,
        #                   "consensus_threshold": 0.5,
        #                   "X_grid_lines": False,
        #                   "Y_grid_lines": False
        #                   }
        pref_dict = self.user_pref.load_user_pref()
        threshold_value = pref_dict["consensus_threshold"] * 100
        max_nprocs = psutil.cpu_count()
        if max_nprocs > 1:
            max_nprocs = max_nprocs - 1
        self.app_settings.checkBox_ambi_warning.setChecked(pref_dict["display_ambiguous_warning"])
        self.app_settings.checkBox_save_qual_report.setChecked(pref_dict["auto_save_sp_qual"])
        self.app_settings.checkBox_show_x_grid.setChecked(pref_dict["X_grid_lines"])
        self.app_settings.checkBox_show_y_grid.setChecked(pref_dict["Y_grid_lines"])
        self.app_settings.spinBox_consensus_threshold.setValue(threshold_value)
        self.app_settings.checkBox_normalize_simplot.setChecked(pref_dict["normalize_simplot"])
        self.app_settings.spinBox_nprocs.setValue(pref_dict["nprocs"])
        self.app_settings.spinBox_nprocs.setMaximum(max_nprocs)
        self.app_settings.checkBox_network_svg.setChecked(pref_dict["network_svg"])

    def save_user_pref(self):
        threshold_value = self.app_settings.spinBox_consensus_threshold.value()/100
        updated_pref_dict = {"display_ambiguous_warning": str(self.app_settings.checkBox_ambi_warning.isChecked()),
                          "auto_save_sp_qual": str(self.app_settings.checkBox_save_qual_report.isChecked()),
                          "consensus_threshold": str(threshold_value),
                          "X_grid_lines": str(self.app_settings.checkBox_show_x_grid.isChecked()),
                          "Y_grid_lines": str(self.app_settings.checkBox_show_y_grid.isChecked()),
                             "normalize_simplot": str(self.app_settings.checkBox_normalize_simplot.isChecked()),
                             "nprocs": str(self.app_settings.spinBox_nprocs.value()),
                             "network_svg": str(self.app_settings.checkBox_network_svg.isChecked())
                          }

        self.user_pref.create_preference_config_file(updated_pref_dict)
        self.user_pref_dict = self.user_pref.load_user_pref()


    def save_consensus_fasta(self, recomb_test=False, recomb_consensus= None):

        if self.groups is not None:
            filepath = self.groups.get_file_path()
            filetype = self.groups.get_file_format()
            datatype = self.groups.get_datatype()
            group_dict = self.groups.return_groups_dict() #todo make sure groups exist
            progress_bar = self.ui.progressBar_global
            if recomb_test == True:
                consensus_threshold = self.user_pref_dict["consensus_threshold"]
            else:
                consensus_threshold = self.app_settings.spinBox_consensus_threshold.value()/100
            self.analysis_instance = SimplotAnalysis(filepath, filetype, datatype, group_dict,consensus_threshold, progress_bar, self.status)
            consensus_dict = self.analysis_instance.get_consensus_dict()

            default_path = pathlib.Path("stored/consensus_output.fasta")
            with open(default_path, "w") as fasta_output:
                for id, consensus in consensus_dict.items():
                    group_name = id.replace(" ", "_")
                    fasta_output.write(f">{group_name}\n{consensus}\n\n")

            if recomb_test is False:
                if default_path.is_file():
                    outpath = pathlib.Path(self.saveFileDialog() + ".fasta")
                    if outpath != "":
                        copyfile(default_path, outpath)
                        self.app_settings.label_dwld.setText("Done")
                        self.app_settings.label_dwld.setStyleSheet("QLabel {color : Green; }")

            self.ui.progressBar_global.setValue(0)

        else:
            self.app_settings.label_dwld.setText("Failed - no groups")
            self.app_settings.label_dwld.setStyleSheet("QLabel {color : Red; }")



    ##########################
    # model_dialog functions #
    ##########################

    def open_model_settings_dialog(self):
        datatype = self.groups.get_datatype()
        dialog = QtWidgets.QDialog()
        dialog.setWindowFlags(Qt.WindowCloseButtonHint)
        self.model_ui.setupUi(dialog)

        if self.analysis_instance.get_datatype() == "DNA":
            self.select_dna()
        else:
            self.select_protein()

        self.setup_model_settings()

        self.enable_model_options() #here

        self.model_ui.btn_data_dna.clicked.connect(lambda: self.select_dna())
        self.model_ui.btn_data_protein.clicked.connect(lambda: self.select_protein())
        self.model_ui.buttonBox.accepted.connect(lambda: self.update_model_settings())
        self.model_ui.checkBox_auto.stateChanged.connect(lambda: self.model_ui.SpinBox_param_a.setEnabled(False) if self.model_ui.checkBox_auto.isChecked() else self.model_ui.SpinBox_param_a.setEnabled(True))
        self.model_ui.comboBox_models.currentIndexChanged.connect(lambda: self.enable_model_options())

        dialog.exec_()

    def enable_model_options(self):
        gap_penalty_models = ["Hamming", "Jukes-Cantor"]
        param_a_models = ["JinNeiGamma"]
        optimized_models = ["F81 - optimized","HKY85 - optimized","TN93 - optimized","GTR - optimized","ssGN - optimized"]

        model = str(self.model_ui.comboBox_models.currentText())
        if model in gap_penalty_models:
            self.model_ui.label_9.setHidden(False)
            self.model_ui.label_8.setHidden(False)
            self.model_ui.Spin_Box_Gap.setHidden(False)
            self.model_ui.Spin_Box_Gap.setEnabled(True)


            self.model_ui.SpinBox_param_a.setEnabled(False)
            self.model_ui.SpinBox_param_a.setHidden(True)
            self.model_ui.checkBox_auto.setEnabled(False)
            self.model_ui.checkBox_auto.setHidden(True)
            self.model_ui.label_7.setHidden(True)

        elif model in param_a_models:
            self.model_ui.label_9.setHidden(False)
            self.model_ui.label_8.setHidden(True)
            self.model_ui.Spin_Box_Gap.setEnabled(False)
            self.model_ui.Spin_Box_Gap.setHidden(True)

            self.model_ui.label_7.setHidden(False)
            self.model_ui.SpinBox_param_a.setHidden(False)
            self.model_ui.checkBox_auto.setHidden(False)
            self.model_ui.SpinBox_param_a.setEnabled(True)
            self.model_ui.checkBox_auto.setEnabled(True)
            #self.model_ui.radioButton_2_manually.setEnabled(True)
        else:
            self.model_ui.Spin_Box_Gap.setEnabled(False)
            self.model_ui.SpinBox_param_a.setEnabled(False)
            self.model_ui.checkBox_auto.setEnabled(False)
            #self.model_ui.radioButton_2_manually.setEnabled(False)

            self.model_ui.label_9.setHidden(True)
            self.model_ui.label_8.setHidden(True)
            self.model_ui.Spin_Box_Gap.setHidden(True)
            self.model_ui.label_7.setHidden(True)
            self.model_ui.SpinBox_param_a.setHidden(True)
            self.model_ui.checkBox_auto.setHidden(True)

        if model in optimized_models:
            self.model_ui.checkBox_multiproc.setChecked(True)

        model_descript = self.models_text(model)
        if model_descript is not None:
            self.model_ui.textBrowser_model_def.setText(model_descript)

    def setup_model_settings(self):
        settings_dict = self.analysis_instance.get_model_settings()

        self.model_ui.spinBox_window.setMaximum(int(self.analysis_instance.get_sequence_length() - 1))
        self.model_ui.spinBox_step.setMaximum(int(self.analysis_instance.get_sequence_length() * 0.5))
        self.model_ui.spinBox_window.setValue(settings_dict["window"])
        self.model_ui.spinBox_step.setValue(settings_dict["step"])
        self.model_ui.Spin_Box_Gap.setValue(settings_dict["gap"])

        index = self.model_ui.comboBox_models.findText(settings_dict["model"])
        self.model_ui.comboBox_models.setCurrentIndex(index)
        #self.populate_refseq_combobox(settings_dict["refseq"])
        self.model_ui.checkBox_multiproc.setChecked(settings_dict["multiproc"])

        # creates a toggle switch between dna/protein buttons
        if settings_dict["datatype"] == "DNA":
            self.model_ui.btn_data_dna.setChecked(True)
            self.model_ui.btn_data_protein.setChecked(False)
        else:
            self.model_ui.btn_data_dna.setChecked(False)
            self.model_ui.btn_data_protein.setChecked(True)


        if settings_dict["param_a"] is None:
            self.model_ui.SpinBox_param_a.setValue(0)
            self.model_ui.checkBox_auto.setChecked(True)
            #self.model_ui.radioButton_2_manually.setChecked(False)
            self.model_ui.SpinBox_param_a.setEnabled(False)
            self.model_ui.SpinBox_param_a.setHidden(True)
        else:
            self.model_ui.SpinBox_param_a.setValue(settings_dict["param_a"])
            #self.model_ui.radioButton_2_manually.setChecked(True)
            self.model_ui.checkBox_auto.setChecked(False)
            self.model_ui.SpinBox_param_a.setHidden(False)

        if settings_dict["gap_treshold"] is not None:
            possible_gap_treshold = [0.25, 0.33, 0.5, 0.66, 0.75, 1]
            index = possible_gap_treshold.index(settings_dict["gap_treshold"]) + 1
            self.model_ui.comboBox_strip_gap.setCurrentIndex(index)

        else:
            self.model_ui.comboBox_strip_gap.setCurrentIndex(0)

        #print(settings_dict["refresh_rate"])
        if settings_dict["refresh_rate"] == 1:
            self.model_ui.comboBox_refresh_rate.setCurrentText("every window")
        elif settings_dict["refresh_rate"] == 10:
            self.model_ui.comboBox_refresh_rate.setCurrentText("every 10 windows")
        elif settings_dict["refresh_rate"] == 100:
            self.model_ui.comboBox_refresh_rate.setCurrentText("every 100 windows")
        else:
            self.model_ui.comboBox_refresh_rate.setCurrentText("never")

    def update_model_settings(self):

        if self.model_ui.btn_data_dna.isChecked():
            datatype = "DNA"
        else:
            datatype = "protein"

        self.analysis_instance.set_default_settings(False)

        if self.model_ui.comboBox_refresh_rate.currentText() == "every window":
            refresh_rate = 1
        elif self.model_ui.comboBox_refresh_rate.currentText() == "every 10 windows":
            refresh_rate = 10
        elif self.model_ui.comboBox_refresh_rate.currentText() == "every 100 windows":
            refresh_rate = 100
        else:
            refresh_rate = None

        if self.model_ui.checkBox_auto.isChecked():
            param_a = None
        else:
            param_a = self.model_ui.SpinBox_param_a.value()

        index = self.model_ui.comboBox_strip_gap.currentIndex()
        possible_gap_treshold = [None, 0.25, 0.33, 0.5, 0.66, 0.75, 1]
        gap_treshold = possible_gap_treshold[index]

        model = str(self.model_ui.comboBox_models.currentText())
        window = int(self.model_ui.spinBox_window.value())
        step = int(self.model_ui.spinBox_step.value())
        gap = int(self.model_ui.Spin_Box_Gap.value())
        multiproc = self.model_ui.checkBox_multiproc.isChecked()

        settings_dict = {"model": model,
                        "window": window,
                        "step": step,
                        "gap": gap,
                        "param_a": param_a,
                        "datatype": datatype,
                        "refresh_rate": refresh_rate,
                        "gap_treshold": gap_treshold,
                        "multiproc": multiproc
                        }

        self.analysis_instance.update_settings(settings_dict)
        #print(self.analysis_instance.get_model_settings())
        self.simplot_result = None

    def update_model_combo(self, model_list):
        self.model_ui.comboBox_models.clear()
        for model in model_list:
            self.model_ui.comboBox_models.addItem(model)

    def select_dna(self):
        dna_models = ["Jukes-Cantor",
                      "Hamming",
                      "Kimura 2-Parameters",
                      "Tamura",
                      "TajimaNei",
                      "JinNeiGamma",
                      "LogDet",
                      "F84",
                      "F81 - optimized", #F81
                      "HKY85 - optimized", #HKY85
                      "TN93", #tn93
                      "TN93 - optimized", #TN93
                      "GTR - optimized", #GTR
                      "ssGN - optimized", # ssGN
                      "paralinear",
                      "percent",
                      "identity",
                      "benner22", "benner6", "benner74", "dayhoff", "feng", "genetic", "gonnet1992",
                      "hoxd70", "johnson", "jones",
                      "levin", "mclachlan", "mdm78", "blastn", "rao", "risler", "str", "trans", "blosum45", "blosum50",
                      "blosum62",
                      "blosum80", "blosum90", "pam250", "pam30", "pam70"]
        #43 models dna
        # prot 20

        self.model_ui.btn_data_dna.setChecked(True)
        self.model_ui.btn_data_protein.setChecked(False)
        self.update_model_combo(dna_models)

    def select_protein(self):
        protein_models = ["Kimura",
                          "Hamming",
                          "Jukes-Cantor",
                          "DSO78",
                          "AH96",
                          "AH96_mtmammals",
                          "JTT92",
                          "WG01",
                          "paralinear",
                          "logdet",
                          "percent",
                          "identity", "blosum45", "blosum50", "blosum62",
                          "blosum80", "blosum90", "pam250", "pam30", "pam70"
                          ]

        self.model_ui.btn_data_dna.setChecked(False)
        self.model_ui.btn_data_protein.setChecked(True)
        self.update_model_combo(protein_models)

    def models_text(self, model):
        # http://rothlab.ucdavis.edu/genhelp/distances.html
        #https://en.wikipedia.org/wiki/Models_of_DNA_evolution
        #https://evolution.genetics.washington.edu/phylip/doc/dnadist.html
        #https://cogent3.readthedocs.io/en/latest/cookbook/evo_modelling.html#Specifying-substitution-models
        #https://github.com/biopython/biopython/tree/master/Bio/Align/substitution_matrices/data

        optimized_models = [
         "F81 - optimized",  # F81
         "HKY85 - optimized",  # HKY85]
         "TN93 - optimized",  # TN93
         "GTR - optimized",  # GTR
         "ssGN - optimized"  # ssGN
         ]

        benner_models = [
            "benner22", "benner6", "benner74", "genetic"
        ] 

        blosum_models = [
            "blosum45", "blosum50", "blosum62", "blosum80", "blosum90",
        ]

        pam_models = [
            "pam250", "pam30", "pam70"
        ]

        model_descript =""
        clean_model_name = model.replace(" - optimized", "")
        # """if model in trex_models:
        #     model_descript = model_descript + str(clean_model_name) + " model obtained from Trex-online." + "\n\n"
        # elif model in cogent3_models:
        #     model_descript = model_descript + str(clean_model_name) + " model obtained from Cogent3." + "\n\n"
        # elif model in biopython_models:
        #     model_descript = model_descript + str(clean_model_name) + " model obtained from Biopython." + "\n\n"""

        if model in benner_models:
            model_descript = model_descript + "Log-odds scoring matrix by Benner et al. (1994)." + "\n\n"
        elif model in blosum_models:
            model_descript = model_descript + "Block Substitution Matrix used to score alignments between evolutionarily divergent protein sequences. All BLOSUM matrices are based on observed alignments (Henikoff 1992)." + "\n\n"
        elif model in pam_models:
            model_descript = model_descript + "PAM refers to the replacement of a single amino acid in a protein with a different amino acid. These mutations were identified by comparing highly similar sequences with at least 85% identity, and it is assumed that any observed substitutions were the result of a single mutation between the ancestral sequence and one of the present day sequences (Dayhoff, 1978." + "\n\n"

        if model in optimized_models:
            model_descript = model_descript + "This model requires numerical optimisation and can be significantly slower. Multiprocessing is recommended." + "\n\n"
        else:
            model_descript = model_descript + ""

        model_text_dict = {
                      "Hamming" : "The Hamming distance between two equal-length strings of symbols is the number of positions at which the corresponding symbols are different.",
                      "Jukes-Cantor" : "Simplest distance model assuming equal base frequency and equal mutation rates (Jukes and Cantor 1969).",
                      "Kimura 2-Parameters" : "Distance model that assumes an equal base frequency but distinguishes between transition and transversion (Kimura 1980).",
                      "Tamura" : "Extension of the Kimura model that includes a G+C content bias (Tamura 1992).",
                      "TajimaNei" : "This model uses the same equation as the Jukes-Cantor model but the parameters are calculated differently. Also, gaps are always ignored and only exact matches are considered (Tajima and Nei 1984). ",
                      "JinNeiGamma" : "This model takes transitions and transversions into account. It is designed to to be used when the substitution rate varies extensively from site to site. The shape parameter a is the square of the inverse of the coefficient of variation (Tajima and Nei 1984).",
                      "LogDet" : "Computes the distance from the determinant of the empirically observed matrix of joint probabilities of nucleotides in the two sequences (Lockhart et al. 1994; Steel 1994).",
                      "F84" : "The F84 model incorporates different rates of transition and transversion, but also allows for different frequencies of the four nucleotides (Felsenstein and Churchill 1984).",
                      "F81" : "Extension of the JC69 model in which base frequencies are allowed to vary (Felsenstein 1981).",
                      "HKY85" : "This model distinguishes between the rate of transitions and transversions and allows for unequal base frequencies (Hasegawa, Kishino and Yano 1985).",
                      "TN93" : "This model distinguishes between the two different types of transition. Transversions are all assumed to occur at the same rate, but that rate is allowed to be different from both of the rates for transitions. Unequal base frequencies are also allowed (Tamura and Nei 1993).",
                      "GTR" : "The Generalised time reversible (GTR) is the most general neutral, independent, finite-sites, time-reversible model possible (Tavaré 1986).",
                      "ssGN" : "Strand-symmetric general Markov nucleotide model (non-stationary, non-reversible) \n(Kaehler 2017, Journal of Theoretical Biology 420: 144–51).",
                      "paralinear" : "Simple distance model that allows for unequal base frequencies (Lake 1994).",
                      "tn93" : "This model distinguishes between the two different types of transition. Transversions are all assumed to occur at the same rate, but that rate is allowed to be different from both of the rates for transitions. Unequal base frequencies are also allowed (Tamura and Nei 1993).",
                      "percent" : "Simple model that calculates the percentage of similarity.",
                      "Kimura" : "Distance model that assumes an equal base frequency but distinguishes between transition and transversion (Kimura 1980).",
                      "DSO78" : "Protein model based on the Dayhoff empirical model (Dayhoff et al. 1978). ",
                      "AH96" : "Model of amino acid substitution in proteins encoded by mitochondrial DNA (Adachi and Hasegawa 1996).",
                      "AH96_mtmammals" : "Empirical model for mammalian mitochondrial proteins (Adachi and Hasegawa 1996).",
                      "JTT92" : "This model correct for multiple substitutions based on the Jones-Taylor-Thornton (JTT) protein model (Jones et al. 1992).",
                      "WG01" : "Whelan and Goldman (WAG) model.",
                      "dayhoff" : "Model based on the Dayhoff substitution matrix (Dayhoff et al. 1978).",
                      "feng" : "This scoring matrix scoring system takes into account the structural similarities of amino acids, as well as the likelihoods of interchanges (Feng et al. 1985).",
                      "gonnet1992" : "Model based on the Gonnet substitution matrix (Gonnet et al. 1992).",
                      "hoxd70" : " Model based on a matrix derived from aligned segments of human and mouse DNA (Chiaromonte et al. 2002).",
                      "johnson" : "Scoring matrix based on the amino acids structures (Johnson and Overington 1993, Journal of Molecular Biology 233: 716-738).",
                      "jones" : "This model correct for multiple substitutions based on the Jones-Taylor-Thornton (JTT) protein model (Jones, Taylor and Thornton 1992, Computer Applications in the Biosciences: CABIOS 8: 275-282).",
                      "levin": "the Levenshtein distance between two sequences is the minimum number of single-nucleotide edits (insertions, deletions or substitutions) required to change one sequence into the other (Levin, Robson and Garnier 1986, FEBS Letters 205: 303-308).",
                      "mclachlan" : "Scoring matrix based on the conservation of spatial structures in distantly-related protein families (McLachlan 1971, Journal of Molecular Biology 61: 409-424).",
                      "mdm78" : "This model is based on the Mutation Data Matrix developped by Schwartz and Dayhoff (1978).",
                      "rao" : "Scoring matrix for amino acid residue exchanges based on residue characteristic physical parameters (Rao 1987, International Journal of Peptide and Protein Research: 29(2): 276-281).",
                      "risler" : "Scoring matrix based on multi-dimensional statistical methods, efficient for scoring distant sequences(Risler et al. 1988, Journal of Molecular Biology 204(4): 1019-1029).",
                      "schneider" : "Empirical codon substitution matrix (Scheinder, Cannarozzi and Gonnet 2005, BMC Bioinformatics 6:134)",
                      "str" : "Model based on the application of a hybrid set of scoring matrices (Henikoff 1993, Proteins: Structure, Function, and Genetics: 17(1): 49-61).",
                      "trans" : "Model based on a transition and transversion scoring matrix to reduce noise when comparing distantly related sequences (Wheeler 1996)."

                    }

        if clean_model_name in model_text_dict.keys():
            model_descript = model_descript + model_text_dict[clean_model_name]
        return model_descript

    def populate_simplot_refseq_combobox(self, selected_refseq=None):
        self.ui.comboBox_simplot_refseq.clear()

        group_names = self.groups.get_group_names()
        for group in group_names:
            self.ui.comboBox_simplot_refseq.addItem(group)

        if selected_refseq is None:
            self.ui.comboBox_simplot_refseq.setCurrentIndex(0)
        else:
            index = self.ui.comboBox_simplot_refseq.findText(selected_refseq) #model_ui to ui
            self.ui.comboBox_simplot_refseq.setCurrentIndex(index)

        combobox_width = self.ui.comboBox_simplot_refseq.minimumSizeHint().width()
        self.ui.comboBox_simplot_refseq.view().setMinimumWidth(combobox_width)

    #############################Bootscan_settings functions###############################

    def fill_bootscan_settings_dialog(self):
        # old_settings list: (bootstrap, tree_model, window, step, distance_model, t_t, refresh_rate, multiproc) refer to this index
        old_settings = self.bootscan_instance.get_settings()
        self.bootscan_settings_ui.spinBox_bootstrap.setValue(old_settings[0])

        index = self.bootscan_settings_ui.comboBox_tree_model.findText(old_settings[1])
        if index >= 0:
            self.bootscan_settings_ui.comboBox_tree_model.setCurrentIndex(index)

        self.bootscan_settings_ui.spinBox_window.setMaximum(int(self.bootscan_instance.get_sequence_length() - 1))
        self.bootscan_settings_ui.spinBox_step.setMaximum(int(self.bootscan_instance.get_sequence_length() * 0.5))
        self.bootscan_settings_ui.spinBox_window.setValue(old_settings[2])
        self.bootscan_settings_ui.spinBox_step.setValue(old_settings[3])

        index = self.bootscan_settings_ui.comboBox_distance_model.findText(old_settings[4])
        if index >= 0:
            self.bootscan_settings_ui.comboBox_distance_model.setCurrentIndex(index)

        self.bootscan_settings_ui.doubleSpinBox_t_t.setValue(old_settings[5])

        # if old_settings[7] is True:
        #     self.bootscan_settings_ui.radioButton_consense.setChecked(True)

        if old_settings[6] == 1:
            self.bootscan_settings_ui.radioButton_refresh_always.setChecked(True)
        elif old_settings[6] == 10:
            self.bootscan_settings_ui.radioButton_refresh_10.setChecked(True)
        elif old_settings[6] == 100:
            self.bootscan_settings_ui.radioButton_refresh_100.setChecked(True)
        else:
            self.bootscan_settings_ui.radioButton_refresh_never.setChecked(True)

        if old_settings[7] is True:
            self.bootscan_settings_ui.checkBox_bootscan_multiproc.setChecked(True)
        else:
            self.bootscan_settings_ui.checkBox_bootscan_multiproc.setChecked(True)

        dna_models = ["Jukes-Cantor",
                      "Hamming",
                      "Kimura 2-Parameters",
                      "Tamura",
                      "TajimaNei",
                      "JinNeiGamma",
                      "LogDet",
                      "F84",
                      "F81 - optimized", #F81
                      "HKY85 - optimized", #HKY85
                      "TN93", #tn93
                      "TN93 - optimized", #TN93
                      "GTR - optimized", #GTR
                      "ssGN - optimized", # ssGN
                      "paralinear",
                      "percent",
                      "identity",
                      "benner22", "benner6", "benner74", "dayhoff", "feng", "genetic", "gonnet1992",
                      "hoxd70", "johnson", "jones",
                      "levin", "mclachlan", "mdm78", "blastn", "rao", "risler", "str", "trans", "blosum45", "blosum50",
                      "blosum62",
                      "blosum80", "blosum90", "pam250", "pam30", "pam70"]

        self.bootscan_settings_ui.comboBox_distance_model.clear()
        for model in dna_models:
            self.bootscan_settings_ui.comboBox_distance_model.addItem(model)


    def update_bootscan_settings(self):
        old_settings = self.bootscan_instance.get_settings()

        if self.bootscan_settings_ui.radioButton_refresh_always.isChecked():
            refresh_rate = 1
        elif self.bootscan_settings_ui.radioButton_refresh_10.isChecked():
            refresh_rate = 10
        elif self.bootscan_settings_ui.radioButton_refresh_100.isChecked():
            refresh_rate = 100
        else:
            refresh_rate = None

        modified_model_names = {"Hamming": "Hamming",
                                "Kimura 2-Parameters": "Kimura2Parameter",
                                "Jukes-Cantor": "JC69_nucleo",
                                "F81 - optimized": "F81",
                                "HKY85 - optimized": "HKY85",
                                "TN93": "tn93",
                                "TN93 - optimized": "TN93",
                                "GTR - optimized": "GTR",
                                "ssGN - optimized": "ssGN"
                                }

        model = self.bootscan_settings_ui.comboBox_distance_model.currentText()
        if model in modified_model_names.keys():
            model = modified_model_names[model]

        new_settings = [self.bootscan_settings_ui.spinBox_bootstrap.value(),
                        self.bootscan_settings_ui.comboBox_tree_model.currentText(),
                        self.bootscan_settings_ui.spinBox_window.value(),
                        self.bootscan_settings_ui.spinBox_step.value(),
                        model,
                        self.bootscan_settings_ui.doubleSpinBox_t_t.value(),
                        refresh_rate,
                        self.bootscan_settings_ui.checkBox_bootscan_multiproc.isChecked()]

        self.bootscan_instance.set_settings(new_settings)

        new_settings = self.bootscan_instance.get_settings()

        if old_settings != new_settings:
            self.bootscan_result_dict = None

    def populate_bootscan_refseq_combobox(self, selected_refseq=None):
        self.ui.comboBox_Bootscan_refseq.clear()

        group_names = self.groups.get_group_names()
        for group in group_names:
            self.ui.comboBox_Bootscan_refseq.addItem(group)

        if selected_refseq is None:
            self.ui.comboBox_Bootscan_refseq.setCurrentIndex(0)
        else:
            index = self.model_ui.comboBox_refseq.findText(selected_refseq)
            self.ui.comboBox_Bootscan_refseq.setCurrentIndex(index)

        self.ui.comboBox_Bootscan_refseq.setStyleSheet("QComboBox"
                                                       "{"
                                                       "min-width : 175px;"
                                                       "}"
                                                       "QComboBox::! on:pressed"
                                                       "{"
                                                       "border : solid black;"
                                                       "border-width : 5px 1px 10px 3px;"
                                                       "}")

    ################### findSites buttons######################
    def populate_findsites_btn(self):
        self.ui.comboBox_query.clear()
        self.ui.comboBox_ref1.clear()
        self.ui.comboBox_ref2.clear()
        self.ui.comboBox_outgroup.clear()

        seq_list = self.groups.get_seq_list()
        for seq in seq_list:
            self.ui.comboBox_query.addItem(seq)
            self.ui.comboBox_ref1.addItem(seq)
            self.ui.comboBox_ref2.addItem(seq)
            self.ui.comboBox_outgroup.addItem(seq)


    ##########################################################################

    def show(self):
        self.main_win.show()


#todo webenginepage

# class WebEnginePage(QtWebEngineWidgets.QWebEnginePage):
#     def __init__(self, *args, **kwargs):
#         QtWebEngineWidgets.QWebEnginePage.__init__(self, *args, **kwargs)
#         self.profile().downloadRequested.connect(self.on_downloadRequested)
#
#     @QtCore.pyqtSlot(QtWebEngineWidgets.QWebEngineDownloadItem)
#     def on_downloadRequested(self, download):
#         print("download request")
#         old_path = download.path()
#         suffix = "png"
#         path, _ = QtWidgets.QFileDialog.getSaveFileName(self.view(), "Save File", old_path, "*."+suffix)
#         if path:
#             download.setPath(path)
#             download.accept()


######################### matplotlib ##############################

class MplCanvas(FigureCanvasQTAgg):
    def __init__(self, parent=None, width=5, height=4, dpi=100, ):  # 5 4 100
        fig = Figure(figsize=(width, height), dpi=dpi)
        self.axes = fig.add_subplot(111)
        self.fig = fig

        FigureCanvasQTAgg.__init__(self, fig)
        self.setParent = parent


class Stream(QtCore.QObject):
    """Redirects console output to text widget."""
    newText = QtCore.pyqtSignal(str)

    def write(self, text):
        self.newText.emit(str(text))


class Worker_recomb(QObject):
    finished = pyqtSignal()

    def __init__(self, instance, data, textedit):
        super().__init__()
        self.instance = instance
        self.settings = data
        self.output = textedit

    def run(self):
        """Long-running task."""
        if self.settings["test"] == "phi-test":
            self.instance.calc_phi(datafile=self.settings["datafile"],
                                   datatype=self.settings["datatype"],
                                   align_kind=self.settings["align_kind"],
                                   do_perm=self.settings["permutations"],
                                   window_size=self.settings["window_size"],
                                   other_stats=self.settings["other_stats"],
                                   multiproc=self.settings["multiproc"],
                                   verbose=self.settings["verbose"])

        if self.settings["test"] == "profile":
            self.instance.calc_profile(datafile=self.settings["datafile"],
                                       datatype=self.settings["datatype"],
                                       align_kind=self.settings["align_kind"],
                                       do_perm=self.settings["permutations"],
                                       window_size=self.settings["window_size"],
                                       break_window=self.settings["break_window"],
                                       step_size=self.settings["step"],
                                       multiproc=self.settings["multiproc"],
                                       verbose=self.settings["verbose"])

        if self.settings["save_output"]:
            self.save_recombination_output()
        self.finished.emit()

    def save_recombination_output(self):
        temp_file = pathlib.Path("stored/recombination_output.txt")
        with open(temp_file, 'w') as f:
            f.write(str(self.output.toPlainText()))
        if temp_file.is_file():
            save_path = self.settings["datafile"].parents[0]
            timestr = time.strftime("%Y%m%d-%H.%M.%S")
            file_name = self.settings["datafile"].stem + "-log" + timestr + ".txt"
            outpath = save_path / file_name
            if outpath != "":
                copyfile(temp_file, outpath)

class Worker_simplot(QObject):
    finished = pyqtSignal()
    return_result = pyqtSignal(dict)
    update_progress_bar = pyqtSignal(int)
    process_stopped = pyqtSignal()
    #update_canvas = pyqtSignal(dict)

    def __init__(self, instance, settings, output, canvas, run_status, status_label):
        super().__init__()
        self.instance = instance
        self.settings = settings
        self.simplot_result = output
        self.simplot_canvas = canvas
        self.run_status = run_status
        self.status_label = status_label

        # self.instance.test = self.StatusLabel

    def run(self):
        self.status_label.setText(f"Launching analysis")
        multiproc = self.settings["multiproc"]
        window_length = self.settings["window"]
        step = self.settings["step"]
        seq_length = self.settings["seq_length"]
        refseq = self.settings["refseq"]
        iter = self.settings["iter"]
        plot_progress = self.settings["plot_progress"]
        refresh_rate = self.settings["refresh_rate"]
        network_analysis = self.settings["network_analysis"]
        distance_recomb = self.settings["distance_recomb"]
        normalize_simplot = self.settings["normalize_simplot"]
        nprocs = self.settings["nprocs"]

        if plot_progress and network_analysis is False and distance_recomb is False:
            refresh_rate = refresh_rate
        else:
            refresh_rate = None

        self.status_label.setText(f"Initializing SimPlot")

        if multiproc:
            start_pos_list = self.calculate_all_start_pos(window_length, seq_length, step)

            raw_dist_matrices = self.mp_simplot(start_pos_list, nprocs)
            self.status_label.setText(f"Aggregating SimPlot results")
            dist_dict = self.instance.create_dist_dict()
            if self.run_status.get_status():
                for column, dist_matrix in raw_dist_matrices.items():
                    real_column = str(int(column + (window_length / 2)))
                    dist_dict = self.instance.extract_all_distances(dist_matrix, real_column, dist_dict)

        else:
            # self.instance.status_label = self.status_label
            i = 0
            start_pos = 0
            dist_dict = None
            while start_pos + window_length < seq_length and self.run_status.get_status():
                self.status_label.setText(f"SimPlot: Completed {int((i/(iter-1))*100)} % of windows")
                dist_dict = self.instance.get_all_distances(start_pos, dist_dict, multiproc=False)
                start_pos += step
                if refresh_rate is not None and plot_progress and i % refresh_rate == 0 and network_analysis is False and distance_recomb is False:
                    if normalize_simplot:
                        temp_df = self.min_max_normalization(dist_dict[refseq])
                    else:
                        temp_df = 1 - dist_dict[refseq]
                    self.update_simplot_canvas(temp_df)

                self.update_progress_bar.emit(int((i / iter * 90) + 5))

                i += 1

        if dist_dict is not None:
            for group, df in dist_dict.items():
                if normalize_simplot:
                    dist_dict[group] = self.min_max_normalization(df)
                else:
                    dist_dict[group] = 1 - df


                if group in df.index:
                    dist_dict[group] = dist_dict[group].drop(group, axis=0)

        # if network_analysis:
        #     return dist_dict
        if main_win.status.get_status() is False:
            self.process_stopped.emit()
            self.update_progress_bar.emit(0)
        else:
            self.simplot_result = dist_dict
            self.return_result.emit(dist_dict)
            self.update_progress_bar.emit(100)
            self.update_progress_bar.emit(0)

        self.finished.emit()


    def min_max_normalization(self, df):
        column_maxes = df.max()
        df_min = 0
        df_max = column_maxes.max()
        if df_max == df_min:
            similarity_df = None
        else:
            similarity_df = 1 - (df - df_min) / (df_max - df_min)

        return similarity_df

    def calculate_all_start_pos(self, window_length, seq_length, step):
        start_pos = 0
        start_pos_list = []
        while start_pos + window_length < seq_length:
            start_pos_list.append(start_pos)
            start_pos += step

        return start_pos_list

    def mp_simplot(self, start_pos_list, nprocs):
        i = 0
        result_dict = {}
        self.instance.status_label = None  # QLabel cannot be pickled
        self.status_label.setText(f"Initializing the ProcessPool with {nprocs} cores")
        with ProcessPoolExecutor(max_workers=nprocs) as executor:
            for num, factors in zip(start_pos_list, executor.map(self.instance.get_all_distances, start_pos_list)):
                self.update_progress_bar.emit(int((i / len(start_pos_list) * 90)+5))
                if self.run_status.get_status():
                    self.status_label.setText(f"SimPlot: completed {int((i / len(start_pos_list))*100)} % of windows")
                i += 1
                result_dict[num] = factors
        return result_dict

    def update_simplot_canvas(self, df):
        groups_colors_dict = self.settings["groups_colors_dict"]
        iter = self.settings["iter"]
        refseq = self.settings["refseq"]

        try:
            groups_colors_dict.pop(refseq)

        except:
            pass

        if df is not None:
            df = df.drop(refseq, axis=0)

            # Update axes and data
            self.simplot_canvas.axes.cla()
            self.simplot_canvas.axes.set_xlabel("Position", fontsize="12")
            self.simplot_canvas.axes.set_ylabel("Similarity", fontsize="12")
            self.simplot_canvas.axes.set_xlim(0, iter)
            df.T.plot(ax=self.simplot_canvas.axes, color=groups_colors_dict.values())
            # Need both of these in order to rescale
            self.simplot_canvas.axes.relim()
            self.simplot_canvas.axes.autoscale_view()
            # We need to draw *and* flush
            self.simplot_canvas.draw_idle()
            self.simplot_canvas.flush_events()
            plt.pause(0.05)

class Worker_bootscan(QObject):
    finished = pyqtSignal()
    progress = pyqtSignal(int)
    return_result = pyqtSignal(dict)
    update_progress_bar = pyqtSignal(int)
    process_stopped = pyqtSignal()
    #update_canvas = pyqtSignal(dict)

    def __init__(self, instance, settings, canvas, run_status, status_label):
        super().__init__()
        self.instance = instance
        self.settings = settings
        self.bootscan_canvas = canvas
        self.run_status = run_status
        self.status_label = status_label

    def run(self):
        self.status_label.setText(f"Launching analysis")
        window_length = self.settings["window_length"]
        step = self.settings["step"]
        seq_length = self.settings["seq_length"]
        refseq = self.settings["refseq"]
        iter = self.settings["iter"]
        refresh_rate = self.settings["refresh_rate"]
        nprocs = self.settings["nprocs"]

        multiproc = self.settings["multiproc"]

        self.status_label.setText(f"Initializing BootScan")
        if multiproc:
            start_pos_list = self.calculate_all_start_pos(window_length, seq_length, step)
            dist_dict = self.mp_bootscan(start_pos_list, nprocs)
            self.status_label.setText(f"Aggregating BootScan results")

        else:
            i = 0
            start_pos = 0
            dist_dict = None
            while start_pos + window_length < seq_length and self.run_status.get_status():
                dist_dict = self.instance.compute_bootscan(start_pos, dist_dict, multiproc=False)
                self.status_label.setText(f"SimPlot: Completed {int((i/(iter-1))*100)} % of windows")
                start_pos += step
                plot_progress = True
                if refresh_rate is not None and plot_progress and i % refresh_rate == 0:
                    temp_df = dist_dict[refseq]
                    self.update_bootscan_canvas(temp_df)

                self.update_progress_bar.emit(int((i / iter * 90) + 5))
                i += 1

        self.update_progress_bar.emit(100)

        if main_win.status.get_status() is False:
            self.process_stopped.emit()
            self.update_progress_bar.emit(0)
        else:
            self.update_progress_bar.emit(0)
            self.return_result.emit(dist_dict)

        self.finished.emit()

    def update_bootscan_canvas(self, df):
        groups_colors_dict = self.settings["groups_colors_dict"]
        iter = self.settings["iter"]
        refseq = self.settings["refseq"]

        try:
            groups_colors_dict.pop(refseq)

        except:
            pass

        if df is not None:
            df = df.drop(refseq, axis=0)

            # Update axes and data
            self.bootscan_canvas.axes.cla()
            self.bootscan_canvas.axes.set_xlabel("Position", fontsize="12")
            self.bootscan_canvas.axes.set_ylabel("Similarity", fontsize="12")
            self.bootscan_canvas.axes.set_xlim(0, iter)
            df.T.plot(ax=self.bootscan_canvas.axes, color=groups_colors_dict.values())
            # Need both of these in order to rescale
            self.bootscan_canvas.axes.relim()
            self.bootscan_canvas.axes.autoscale_view()
            # We need to draw *and* flush
            self.bootscan_canvas.draw_idle()
            self.bootscan_canvas.flush_events()
            plt.pause(0.05)

    def mp_bootscan(self, start_pos_list, nprocs):
        i = 0
        # result_dict  = {}
        self.status_label.setText(f"Initializing the ProcessPool with {nprocs} cores")
        result_dict = self.instance.build_result_dict()

        with ProcessPoolExecutor(max_workers=nprocs) as executor:
            for num, occur_dict in zip(start_pos_list,
                                    executor.map(self.instance.compute_bootscan, start_pos_list)):
                result_dict = self.instance.update_result_dict(occur_dict, num, result_dict)
                self.update_progress_bar.emit(int((i / len(start_pos_list) * 90) + 5))
                if self.run_status.get_status():
                    self.status_label.setText(f"BootScan: completed {int((i / len(start_pos_list))*100)} % of windows")
                i += 1
                #result_dict[num] = occur_dict
        return result_dict

    def calculate_all_start_pos(self, window_length, seq_length, step):
        start_pos = 0
        start_pos_list = []
        while start_pos + window_length < seq_length:
            start_pos_list.append(start_pos)
            start_pos += step

        return start_pos_list


class MyWindow(QMainWindow):
    def closeEvent(self, event):
        reply = QtWidgets.QMessageBox.question(self, 'Quit', 'Are you sure you want to quit?\n'
                                                             'Unsaved groups and results will be lost.',
                                               QtWidgets.QMessageBox.Yes | QtWidgets.QMessageBox.No, QtWidgets.QMessageBox.No)
        if reply == QtWidgets.QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()


def kill_workers():
    main_win.status.terminate()
    if main_win.thread is not None:
        # main_win.thread.quit()
        # main_win.thread.wait()
        main_win.thread = None
    else:
        return

if __name__ == "__main__":
    #os.chdir(sys.path[0])
    freeze_support()
    app = QApplication(sys.argv)
    app.aboutToQuit.connect(kill_workers)
    main_win = MainWindow()
    main_win.show()
    sys.exit(app.exec_())