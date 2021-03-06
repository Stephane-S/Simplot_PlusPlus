# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file '.\bootscan_dialog.ui'
#
# Created by: PyQt5 UI code generator 5.15.0
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets


class Ui_Dialog(object):
    def setupUi(self, Dialog):
        Dialog.setObjectName("Dialog")
        Dialog.resize(400, 332)
        self.verticalLayout = QtWidgets.QVBoxLayout(Dialog)
        self.verticalLayout.setObjectName("verticalLayout")
        self.frame = QtWidgets.QFrame(Dialog)
        self.frame.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame.setObjectName("frame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.frame)
        self.horizontalLayout.setContentsMargins(0, 9, 0, 0)
        self.horizontalLayout.setSpacing(0)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.groupBox = QtWidgets.QGroupBox(self.frame)
        self.groupBox.setAlignment(QtCore.Qt.AlignLeading|QtCore.Qt.AlignLeft|QtCore.Qt.AlignVCenter)
        self.groupBox.setCheckable(False)
        self.groupBox.setObjectName("groupBox")
        self.gridLayout = QtWidgets.QGridLayout(self.groupBox)
        self.gridLayout.setContentsMargins(0, 0, 0, 0)
        self.gridLayout.setSpacing(0)
        self.gridLayout.setObjectName("gridLayout")
        self.comboBox_tree_model = QtWidgets.QComboBox(self.groupBox)
        self.comboBox_tree_model.setObjectName("comboBox_tree_model")
        self.comboBox_tree_model.addItem("")
        self.comboBox_tree_model.addItem("")
        self.gridLayout.addWidget(self.comboBox_tree_model, 1, 1, 1, 1)
        self.spinBox_bootstrap = QtWidgets.QSpinBox(self.groupBox)
        self.spinBox_bootstrap.setMinimum(50)
        self.spinBox_bootstrap.setMaximum(1000)
        self.spinBox_bootstrap.setSingleStep(50)
        self.spinBox_bootstrap.setProperty("value", 100)
        self.spinBox_bootstrap.setObjectName("spinBox_bootstrap")
        self.gridLayout.addWidget(self.spinBox_bootstrap, 0, 1, 1, 1)
        self.label_6 = QtWidgets.QLabel(self.groupBox)
        self.label_6.setAlignment(QtCore.Qt.AlignCenter)
        self.label_6.setObjectName("label_6")
        self.gridLayout.addWidget(self.label_6, 5, 0, 1, 1)
        self.label_3 = QtWidgets.QLabel(self.groupBox)
        self.label_3.setObjectName("label_3")
        self.gridLayout.addWidget(self.label_3, 2, 0, 1, 1)
        self.label_5 = QtWidgets.QLabel(self.groupBox)
        self.label_5.setObjectName("label_5")
        self.gridLayout.addWidget(self.label_5, 4, 0, 1, 1)
        self.comboBox_distance_model = QtWidgets.QComboBox(self.groupBox)
        self.comboBox_distance_model.setObjectName("comboBox_distance_model")
        self.gridLayout.addWidget(self.comboBox_distance_model, 4, 1, 1, 1)
        self.spinBox_step = QtWidgets.QSpinBox(self.groupBox)
        self.spinBox_step.setMinimum(10)
        self.spinBox_step.setMaximum(200)
        self.spinBox_step.setSingleStep(10)
        self.spinBox_step.setProperty("value", 20)
        self.spinBox_step.setObjectName("spinBox_step")
        self.gridLayout.addWidget(self.spinBox_step, 3, 1, 1, 1)
        self.label = QtWidgets.QLabel(self.groupBox)
        self.label.setObjectName("label")
        self.gridLayout.addWidget(self.label, 0, 0, 1, 1)
        self.spinBox_window = QtWidgets.QSpinBox(self.groupBox)
        self.spinBox_window.setMinimum(20)
        self.spinBox_window.setMaximum(1000)
        self.spinBox_window.setSingleStep(20)
        self.spinBox_window.setProperty("value", 200)
        self.spinBox_window.setObjectName("spinBox_window")
        self.gridLayout.addWidget(self.spinBox_window, 2, 1, 1, 1)
        self.label_4 = QtWidgets.QLabel(self.groupBox)
        self.label_4.setObjectName("label_4")
        self.gridLayout.addWidget(self.label_4, 3, 0, 1, 1)
        self.doubleSpinBox_t_t = QtWidgets.QDoubleSpinBox(self.groupBox)
        self.doubleSpinBox_t_t.setMaximum(99.0)
        self.doubleSpinBox_t_t.setProperty("value", 2.0)
        self.doubleSpinBox_t_t.setObjectName("doubleSpinBox_t_t")
        self.gridLayout.addWidget(self.doubleSpinBox_t_t, 5, 1, 1, 1)
        self.label_2 = QtWidgets.QLabel(self.groupBox)
        self.label_2.setObjectName("label_2")
        self.gridLayout.addWidget(self.label_2, 1, 0, 1, 1)
        self.horizontalLayout.addWidget(self.groupBox)
        self.frame_2 = QtWidgets.QFrame(self.frame)
        self.frame_2.setMaximumSize(QtCore.QSize(150, 10000))
        self.frame_2.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame_2.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame_2.setObjectName("frame_2")
        self.verticalLayout_2 = QtWidgets.QVBoxLayout(self.frame_2)
        self.verticalLayout_2.setContentsMargins(5, 0, 0, 0)
        self.verticalLayout_2.setSpacing(0)
        self.verticalLayout_2.setObjectName("verticalLayout_2")
        self.groupBox_2 = QtWidgets.QGroupBox(self.frame_2)
        self.groupBox_2.setMaximumSize(QtCore.QSize(140, 75))
        self.groupBox_2.setObjectName("groupBox_2")
        self.verticalLayout_3 = QtWidgets.QVBoxLayout(self.groupBox_2)
        self.verticalLayout_3.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_3.setSpacing(0)
        self.verticalLayout_3.setObjectName("verticalLayout_3")
        self.radioButton_refresh_always = QtWidgets.QRadioButton(self.groupBox_2)
        self.radioButton_refresh_always.setObjectName("radioButton_refresh_always")
        self.verticalLayout_3.addWidget(self.radioButton_refresh_always)
        self.radioButton_refresh_10 = QtWidgets.QRadioButton(self.groupBox_2)
        self.radioButton_refresh_10.setObjectName("radioButton_refresh_10")
        self.verticalLayout_3.addWidget(self.radioButton_refresh_10)
        self.radioButton_refresh_100 = QtWidgets.QRadioButton(self.groupBox_2)
        self.radioButton_refresh_100.setObjectName("radioButton_refresh_100")
        self.verticalLayout_3.addWidget(self.radioButton_refresh_100)
        self.radioButton_refresh_never = QtWidgets.QRadioButton(self.groupBox_2)
        self.radioButton_refresh_never.setObjectName("radioButton_refresh_never")
        self.verticalLayout_3.addWidget(self.radioButton_refresh_never)
        self.verticalLayout_2.addWidget(self.groupBox_2)
        self.checkBox_bootscan_multiproc = QtWidgets.QCheckBox(self.frame_2)
        self.checkBox_bootscan_multiproc.setTristate(False)
        self.checkBox_bootscan_multiproc.setObjectName("checkBox_bootscan_multiproc")
        self.verticalLayout_2.addWidget(self.checkBox_bootscan_multiproc)
        spacerItem = QtWidgets.QSpacerItem(20, 180, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Fixed)
        self.verticalLayout_2.addItem(spacerItem)
        self.horizontalLayout.addWidget(self.frame_2)
        self.verticalLayout.addWidget(self.frame)
        self.buttonBox = QtWidgets.QDialogButtonBox(Dialog)
        self.buttonBox.setOrientation(QtCore.Qt.Horizontal)
        self.buttonBox.setStandardButtons(QtWidgets.QDialogButtonBox.Cancel|QtWidgets.QDialogButtonBox.Ok)
        self.buttonBox.setObjectName("buttonBox")
        self.verticalLayout.addWidget(self.buttonBox)

        self.retranslateUi(Dialog)
        self.buttonBox.accepted.connect(Dialog.accept)
        self.buttonBox.rejected.connect(Dialog.reject)
        QtCore.QMetaObject.connectSlotsByName(Dialog)

    def retranslateUi(self, Dialog):
        _translate = QtCore.QCoreApplication.translate
        Dialog.setWindowTitle(_translate("Dialog", "Bootscan Settings"))
        self.groupBox.setTitle(_translate("Dialog", "Bootscan Settings"))
        self.comboBox_tree_model.setItemText(0, _translate("Dialog", "Neighbor-Joining"))
        self.comboBox_tree_model.setItemText(1, _translate("Dialog", "UPGMA"))
        self.label_6.setText(_translate("Dialog", "<html><head/><body><p>Transition/<br/>Transversion<br/>ratio</p></body></html>"))
        self.label_3.setText(_translate("Dialog", "Window length"))
        self.label_5.setText(_translate("Dialog", "Distance model"))
        self.label.setText(_translate("Dialog", "Bootstrap"))
        self.label_4.setText(_translate("Dialog", "Step"))
        self.label_2.setText(_translate("Dialog", "Tree model"))
        self.groupBox_2.setTitle(_translate("Dialog", "Plot Refresh Rate"))
        self.radioButton_refresh_always.setText(_translate("Dialog", "Every iteration (slowest)"))
        self.radioButton_refresh_10.setText(_translate("Dialog", "Every 10 iterations"))
        self.radioButton_refresh_100.setText(_translate("Dialog", "Every 100 iterations"))
        self.radioButton_refresh_never.setText(_translate("Dialog", "Never (fastest)"))
        self.checkBox_bootscan_multiproc.setText(_translate("Dialog", "Multiprocessing"))
