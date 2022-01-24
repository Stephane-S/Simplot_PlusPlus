#######################################################################################################################
########################### procedure to modify the group_widget.py file ##############################################
#######################################################################################################################
# This file's layout and .ui comes from "Ui_group_widget.py", obtainable through
# "pyuic5 .\Ui_group_widget.ui -o Ui_group_widget.py" in the child folder "PyQt5_project"
#
# To modify the layout, follow these steps:
#
# 1. replace the layout of the "group_widget.py" from the modified "Ui_group_widget.py"

# 2. make sure "Ui_group_widget.setObjectName("Ui_group_widget")" and "# Ui_group_widget.resize(221, 81)"
# are commented out

# 3. replace all "Ui_group_widget" and "group_widget" variables in layout by "self"

# 4. make sure to add the name to lineEdit_groupName.settext()

# 5. make sure the styles in the functions match the new ones (color button, click, unclick for example)
#######################################################################################################################


from PyQt5 import QtCore, QtWidgets
from PyQt5.QtWidgets import QColorDialog, QMessageBox


class Ui_group_widget(QtWidgets.QWidget):
    test = QtCore.pyqtSignal(bool)
    def __init__(self, name, groups, color=None, parent=None):
        super(QtWidgets.QWidget, self).__init__(parent)
        self.name = name
        self.groups = groups

        ################## beginning of layout #####################################

        # Ui_group_widget.setObjectName("Ui_group_widget")
        # Ui_group_widget.resize(300, 75)
        # Ui_group_widget.setMinimumSize(QtCore.QSize(300, 0))
        # Ui_group_widget.setMaximumSize(QtCore.QSize(300, 75))
        # Ui_group_widget.setStyleSheet("")
        self.verticalLayout = QtWidgets.QVBoxLayout(self)
        self.verticalLayout.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout.setSpacing(0)
        self.verticalLayout.setObjectName("verticalLayout")
        self.frame = QtWidgets.QFrame(self)
        self.frame.setStyleSheet("border-top: 1px solid black;\n"
                                 "\n"
                                 "border-bottom: 1px solid black;")
        self.frame.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame.setObjectName("frame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.frame)
        self.horizontalLayout.setContentsMargins(0, 0, 0, 0)
        self.horizontalLayout.setSpacing(0)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.frame_2 = QtWidgets.QFrame(self.frame)
        self.frame_2.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame_2.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame_2.setObjectName("frame_2")
        self.verticalLayout_2 = QtWidgets.QVBoxLayout(self.frame_2)
        self.verticalLayout_2.setContentsMargins(4, 4, 4, 4)
        self.verticalLayout_2.setSpacing(0)
        self.verticalLayout_2.setObjectName("verticalLayout_2")
        self.Btn_group_color = QtWidgets.QPushButton(self.frame_2)
        self.Btn_group_color.setMinimumSize(QtCore.QSize(60, 60))
        self.Btn_group_color.setStyleSheet("border: 0px;\n"\
                                           "background-color: rgb(0, 170, 255);\n"\
                                           "border-radius: 30px;")
        self.Btn_group_color.setText("")
        self.Btn_group_color.setFlat(False)
        self.Btn_group_color.setObjectName("Btn_group_color")
        self.verticalLayout_2.addWidget(self.Btn_group_color)
        self.horizontalLayout.addWidget(self.frame_2)
        self.frame_4 = QtWidgets.QFrame(self.frame)
        self.frame_4.setStyleSheet("")
        self.frame_4.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame_4.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame_4.setObjectName("frame_4")
        self.verticalLayout_3 = QtWidgets.QVBoxLayout(self.frame_4)
        self.verticalLayout_3.setObjectName("verticalLayout_3")
        self.lineEdit_group_name = QtWidgets.QLineEdit(self.frame_4)
        self.lineEdit_group_name.setStyleSheet("border: 1px solid black")
        self.lineEdit_group_name.setText(name)
        self.lineEdit_group_name.setObjectName("lineEdit_group_name")
        self.verticalLayout_3.addWidget(self.lineEdit_group_name)
        self.label_seq_length = QtWidgets.QLabel(self.frame_4)
        self.label_seq_length.setStyleSheet("border: 0px;")
        self.label_seq_length.setFrameShape(QtWidgets.QFrame.NoFrame)
        self.label_seq_length.setFrameShadow(QtWidgets.QFrame.Plain)
        self.label_seq_length.setLineWidth(-22)
        self.label_seq_length.setText("")
        self.label_seq_length.setObjectName("label_seq_length")
        self.verticalLayout_3.addWidget(self.label_seq_length)
        self.horizontalLayout.addWidget(self.frame_4)
        self.verticalLayout.addWidget(self.frame)

        QtCore.QMetaObject.connectSlotsByName(self)


################### end of layout ###################################################################################

        if color is not None:
            #style = "background-color: " + color + "; border: none;"
            style = "border: 0px;" \
                    "background-color:" + color + ";"\
                    "border-radius: 30px;"
            self.Btn_group_color.setStyleSheet(style)

        ## color dialog pushButton
        self.Btn_group_color.clicked.connect(lambda: self.select_group_color())

        # modify group name
        self.lineEdit_group_name.editingFinished.connect(lambda: self.edit_group_name())

        # page 1 - qlineedit text change

    def mousePressEvent(self, QMouseEvent):
        if QMouseEvent.button() == QtCore.Qt.LeftButton:
            QMouseEvent.ignore()
        if QMouseEvent.button() == QtCore.Qt.RightButton:
            # do what you want here
            print("Right Button Clicked")

    def edit_group_name(self):
        old_name = self.name
        new_name = self.lineEdit_group_name.text()
        temp_old_name = old_name.replace(" ", "_")
        temp_new_name = new_name.replace(" ", "_")
        bool = True

        if old_name != new_name and temp_new_name!= temp_old_name and new_name !="":
            groups_name_list = list(self.groups.get_group_names())
            if new_name not in groups_name_list:
                for name in groups_name_list:
                    if temp_new_name == name.replace(" ", "_"):
                        self.lineEdit_group_name.setText(old_name)
                        self.error_msg_box(f"{new_name} is already a group name")
                        bool = False

                if bool:
                    self.groups.change_group_name(old_name, new_name)
                    self.name = new_name
                    print ("done")
            else:
                self.lineEdit_group_name.setText(old_name)
                self.error_msg_box(f"{new_name} is already a group name")

    def select_group_color(self):
        color = QColorDialog.getColor()

        if color.isValid():
            style = "border: 0px;" \
                    "background-color:" + str(color.name()) + ";" \
                    "border-radius: 30px;"
            self.Btn_group_color.setStyleSheet(style)
            self.groups.add_group_color(self.name, str(color.name()))
            self.groups.show_groups_colors()

    def error_msg_box(self, error_msg):
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Warning)
        msg.setText(error_msg)
        msg.setWindowTitle("Error")
        msg.exec_()

    def clicked(self):
        self.frame.setStyleSheet("border-bottom: 1px solid black; background-color: rgb(207, 207, 207);")

    def unclicked(self):
        self.frame.setStyleSheet("border-bottom: 1px solid black;")

    def get_group_name(self):
        return self.lineEdit_group_name.text()
