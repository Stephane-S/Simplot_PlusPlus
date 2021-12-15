# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'seq_window.ui'
#
# Created by: PyQt5 UI code generator 5.13.0
#
# WARNING! All changes made in this file will be lost!


from PyQt5 import QtCore, QtGui, QtWidgets


class Ui_Seq_window(object):
    def setupUi(self, Seq_window, groupName):
        Seq_window.setObjectName("Seq_window")
        Seq_window.resize(958, 411)
        self.buttonBox = QtWidgets.QDialogButtonBox(Seq_window)
        self.buttonBox.setGeometry(QtCore.QRect(280, 370, 341, 32))
        self.buttonBox.setOrientation(QtCore.Qt.Horizontal)
        self.buttonBox.setStandardButtons(QtWidgets.QDialogButtonBox.Cancel|QtWidgets.QDialogButtonBox.Ok)
        self.buttonBox.setObjectName("buttonBox")
        self.horizontalLayoutWidget = QtWidgets.QWidget(Seq_window)
        self.horizontalLayoutWidget.setGeometry(QtCore.QRect(30, 90, 901, 261))
        self.horizontalLayoutWidget.setObjectName("horizontalLayoutWidget")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalLayoutWidget)
        self.horizontalLayout.setContentsMargins(0, 0, 0, 0)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.seqOutput = QtWidgets.QListWidget(self.horizontalLayoutWidget)
        self.seqOutput.setObjectName("seqOutput")
        self.horizontalLayout.addWidget(self.seqOutput)
        self.verticalLayout_2 = QtWidgets.QVBoxLayout()
        self.verticalLayout_2.setContentsMargins(-1, 20, -1, 20)
        self.verticalLayout_2.setSpacing(1)
        self.verticalLayout_2.setObjectName("verticalLayout_2")
        self.mBtnMoveToSelected = QtWidgets.QPushButton(self.horizontalLayoutWidget)
        self.mBtnMoveToSelected.setObjectName("mBtnMoveToSelected")
        self.verticalLayout_2.addWidget(self.mBtnMoveToSelected)
        self.mButtonToAvailable = QtWidgets.QPushButton(self.horizontalLayoutWidget)
        self.mButtonToAvailable.setObjectName("mButtonToAvailable")
        self.verticalLayout_2.addWidget(self.mButtonToAvailable)
        self.mBtnMoveToAvailable = QtWidgets.QPushButton(self.horizontalLayoutWidget)
        self.mBtnMoveToAvailable.setObjectName("mBtnMoveToAvailable")
        self.verticalLayout_2.addWidget(self.mBtnMoveToAvailable)
        self.mButtonToSelected = QtWidgets.QPushButton(self.horizontalLayoutWidget)
        self.mButtonToSelected.setObjectName("mButtonToSelected")
        self.verticalLayout_2.addWidget(self.mButtonToSelected)
        self.horizontalLayout.addLayout(self.verticalLayout_2)
        self.seqInput = QtWidgets.QListWidget(self.horizontalLayoutWidget)
        self.seqInput.setObjectName("seqInput")
        self.horizontalLayout.addWidget(self.seqInput)
        self.horizontalLayoutWidget_2 = QtWidgets.QWidget(Seq_window)
        self.horizontalLayoutWidget_2.setGeometry(QtCore.QRect(30, 29, 891, 51))
        self.horizontalLayoutWidget_2.setObjectName("horizontalLayoutWidget_2")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.horizontalLayoutWidget_2)
        self.horizontalLayout_2.setContentsMargins(0, 0, 0, 0)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.label_2 = QtWidgets.QLabel(self.horizontalLayoutWidget_2)
        self.label_2.setAlignment(QtCore.Qt.AlignCenter)
        self.label_2.setObjectName("label_2")
        self.label_2.setText(groupName)
        self.horizontalLayout_2.addWidget(self.label_2)
        self.label = QtWidgets.QLabel(self.horizontalLayoutWidget_2)
        self.label.setAlignment(QtCore.Qt.AlignCenter)
        self.label.setObjectName("label")
        self.horizontalLayout_2.addWidget(self.label)

        self.retranslateUi(Seq_window)
        self.buttonBox.accepted.connect(Seq_window.accept)
        self.buttonBox.rejected.connect(Seq_window.reject)
        QtCore.QMetaObject.connectSlotsByName(Seq_window)

    def retranslateUi(self, Seq_window):
        _translate = QtCore.QCoreApplication.translate
        Seq_window.setWindowTitle(_translate("Seq_window", "Group Editor"))
        self.mBtnMoveToSelected.setText(_translate("Seq_window", ">>"))
        self.mButtonToAvailable.setText(_translate("Seq_window", ">"))
        self.mBtnMoveToAvailable.setText(_translate("Seq_window", "<"))
        self.mButtonToSelected.setText(_translate("Seq_window", "<<"))
        #self.label_2.setText(_translate("Seq_window", ""))
        self.label.setText(_translate("Seq_window", "Sequences"))
