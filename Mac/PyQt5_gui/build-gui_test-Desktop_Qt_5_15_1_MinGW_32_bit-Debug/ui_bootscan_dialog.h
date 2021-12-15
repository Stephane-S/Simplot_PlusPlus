/********************************************************************************
** Form generated from reading UI file 'bootscan_dialog.ui'
**
** Created by: Qt User Interface Compiler version 5.15.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_BOOTSCAN_DIALOG_H
#define UI_BOOTSCAN_DIALOG_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QDoubleSpinBox>
#include <QtWidgets/QFrame>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QRadioButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QSpinBox>
#include <QtWidgets/QVBoxLayout>

QT_BEGIN_NAMESPACE

class Ui_Dialog
{
public:
    QVBoxLayout *verticalLayout;
    QFrame *frame;
    QHBoxLayout *horizontalLayout;
    QGroupBox *groupBox;
    QGridLayout *gridLayout;
    QComboBox *comboBox_tree_model;
    QSpinBox *spinBox_bootstrap;
    QLabel *label_6;
    QLabel *label_3;
    QLabel *label_5;
    QComboBox *comboBox_distance_model;
    QSpinBox *spinBox_step;
    QLabel *label;
    QSpinBox *spinBox_window;
    QLabel *label_4;
    QDoubleSpinBox *doubleSpinBox_t_t;
    QLabel *label_2;
    QFrame *frame_2;
    QVBoxLayout *verticalLayout_2;
    QGroupBox *groupBox_2;
    QVBoxLayout *verticalLayout_3;
    QRadioButton *radioButton_refresh_always;
    QRadioButton *radioButton_refresh_10;
    QRadioButton *radioButton_refresh_100;
    QRadioButton *radioButton_refresh_never;
    QRadioButton *radioButton_consense;
    QSpacerItem *verticalSpacer;
    QDialogButtonBox *buttonBox;

    void setupUi(QDialog *Dialog)
    {
        if (Dialog->objectName().isEmpty())
            Dialog->setObjectName(QString::fromUtf8("Dialog"));
        Dialog->resize(400, 300);
        verticalLayout = new QVBoxLayout(Dialog);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        frame = new QFrame(Dialog);
        frame->setObjectName(QString::fromUtf8("frame"));
        frame->setFrameShape(QFrame::StyledPanel);
        frame->setFrameShadow(QFrame::Raised);
        horizontalLayout = new QHBoxLayout(frame);
        horizontalLayout->setSpacing(0);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 9, 0, 0);
        groupBox = new QGroupBox(frame);
        groupBox->setObjectName(QString::fromUtf8("groupBox"));
        groupBox->setAlignment(Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter);
        groupBox->setCheckable(false);
        gridLayout = new QGridLayout(groupBox);
        gridLayout->setSpacing(0);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        gridLayout->setContentsMargins(0, 0, 0, 0);
        comboBox_tree_model = new QComboBox(groupBox);
        comboBox_tree_model->addItem(QString());
        comboBox_tree_model->addItem(QString());
        comboBox_tree_model->setObjectName(QString::fromUtf8("comboBox_tree_model"));

        gridLayout->addWidget(comboBox_tree_model, 1, 1, 1, 1);

        spinBox_bootstrap = new QSpinBox(groupBox);
        spinBox_bootstrap->setObjectName(QString::fromUtf8("spinBox_bootstrap"));
        spinBox_bootstrap->setMinimum(50);
        spinBox_bootstrap->setMaximum(1000);
        spinBox_bootstrap->setSingleStep(50);
        spinBox_bootstrap->setValue(100);

        gridLayout->addWidget(spinBox_bootstrap, 0, 1, 1, 1);

        label_6 = new QLabel(groupBox);
        label_6->setObjectName(QString::fromUtf8("label_6"));

        gridLayout->addWidget(label_6, 5, 0, 1, 1);

        label_3 = new QLabel(groupBox);
        label_3->setObjectName(QString::fromUtf8("label_3"));

        gridLayout->addWidget(label_3, 2, 0, 1, 1);

        label_5 = new QLabel(groupBox);
        label_5->setObjectName(QString::fromUtf8("label_5"));

        gridLayout->addWidget(label_5, 4, 0, 1, 1);

        comboBox_distance_model = new QComboBox(groupBox);
        comboBox_distance_model->addItem(QString());
        comboBox_distance_model->addItem(QString());
        comboBox_distance_model->addItem(QString());
        comboBox_distance_model->addItem(QString());
        comboBox_distance_model->setObjectName(QString::fromUtf8("comboBox_distance_model"));

        gridLayout->addWidget(comboBox_distance_model, 4, 1, 1, 1);

        spinBox_step = new QSpinBox(groupBox);
        spinBox_step->setObjectName(QString::fromUtf8("spinBox_step"));
        spinBox_step->setMinimum(10);
        spinBox_step->setMaximum(200);
        spinBox_step->setSingleStep(10);
        spinBox_step->setValue(20);

        gridLayout->addWidget(spinBox_step, 3, 1, 1, 1);

        label = new QLabel(groupBox);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout->addWidget(label, 0, 0, 1, 1);

        spinBox_window = new QSpinBox(groupBox);
        spinBox_window->setObjectName(QString::fromUtf8("spinBox_window"));
        spinBox_window->setMinimum(20);
        spinBox_window->setMaximum(1000);
        spinBox_window->setSingleStep(20);
        spinBox_window->setValue(200);

        gridLayout->addWidget(spinBox_window, 2, 1, 1, 1);

        label_4 = new QLabel(groupBox);
        label_4->setObjectName(QString::fromUtf8("label_4"));

        gridLayout->addWidget(label_4, 3, 0, 1, 1);

        doubleSpinBox_t_t = new QDoubleSpinBox(groupBox);
        doubleSpinBox_t_t->setObjectName(QString::fromUtf8("doubleSpinBox_t_t"));
        doubleSpinBox_t_t->setMaximum(99.000000000000000);
        doubleSpinBox_t_t->setValue(2.000000000000000);

        gridLayout->addWidget(doubleSpinBox_t_t, 5, 1, 1, 1);

        label_2 = new QLabel(groupBox);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        gridLayout->addWidget(label_2, 1, 0, 1, 1);


        horizontalLayout->addWidget(groupBox);

        frame_2 = new QFrame(frame);
        frame_2->setObjectName(QString::fromUtf8("frame_2"));
        frame_2->setMaximumSize(QSize(150, 10000));
        frame_2->setFrameShape(QFrame::StyledPanel);
        frame_2->setFrameShadow(QFrame::Raised);
        verticalLayout_2 = new QVBoxLayout(frame_2);
        verticalLayout_2->setSpacing(0);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        verticalLayout_2->setContentsMargins(5, 0, 0, 0);
        groupBox_2 = new QGroupBox(frame_2);
        groupBox_2->setObjectName(QString::fromUtf8("groupBox_2"));
        groupBox_2->setMaximumSize(QSize(140, 75));
        verticalLayout_3 = new QVBoxLayout(groupBox_2);
        verticalLayout_3->setSpacing(0);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        verticalLayout_3->setContentsMargins(0, 0, 0, 0);
        radioButton_refresh_always = new QRadioButton(groupBox_2);
        radioButton_refresh_always->setObjectName(QString::fromUtf8("radioButton_refresh_always"));

        verticalLayout_3->addWidget(radioButton_refresh_always);

        radioButton_refresh_10 = new QRadioButton(groupBox_2);
        radioButton_refresh_10->setObjectName(QString::fromUtf8("radioButton_refresh_10"));

        verticalLayout_3->addWidget(radioButton_refresh_10);

        radioButton_refresh_100 = new QRadioButton(groupBox_2);
        radioButton_refresh_100->setObjectName(QString::fromUtf8("radioButton_refresh_100"));

        verticalLayout_3->addWidget(radioButton_refresh_100);

        radioButton_refresh_never = new QRadioButton(groupBox_2);
        radioButton_refresh_never->setObjectName(QString::fromUtf8("radioButton_refresh_never"));

        verticalLayout_3->addWidget(radioButton_refresh_never);


        verticalLayout_2->addWidget(groupBox_2);

        radioButton_consense = new QRadioButton(frame_2);
        radioButton_consense->setObjectName(QString::fromUtf8("radioButton_consense"));
        radioButton_consense->setMinimumSize(QSize(0, 30));

        verticalLayout_2->addWidget(radioButton_consense);

        verticalSpacer = new QSpacerItem(20, 150, QSizePolicy::Minimum, QSizePolicy::Fixed);

        verticalLayout_2->addItem(verticalSpacer);


        horizontalLayout->addWidget(frame_2);


        verticalLayout->addWidget(frame);

        buttonBox = new QDialogButtonBox(Dialog);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        verticalLayout->addWidget(buttonBox);


        retranslateUi(Dialog);
        QObject::connect(buttonBox, SIGNAL(accepted()), Dialog, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), Dialog, SLOT(reject()));

        QMetaObject::connectSlotsByName(Dialog);
    } // setupUi

    void retranslateUi(QDialog *Dialog)
    {
        Dialog->setWindowTitle(QCoreApplication::translate("Dialog", "Bootscan Settings", nullptr));
        groupBox->setTitle(QCoreApplication::translate("Dialog", "Bootscan Settings", nullptr));
        comboBox_tree_model->setItemText(0, QCoreApplication::translate("Dialog", "Neighbor-Joining", nullptr));
        comboBox_tree_model->setItemText(1, QCoreApplication::translate("Dialog", "UPGMA", nullptr));

        label_6->setText(QCoreApplication::translate("Dialog", "t/t ratio", nullptr));
        label_3->setText(QCoreApplication::translate("Dialog", "Window Length", nullptr));
        label_5->setText(QCoreApplication::translate("Dialog", "Distance Model", nullptr));
        comboBox_distance_model->setItemText(0, QCoreApplication::translate("Dialog", "F84", nullptr));
        comboBox_distance_model->setItemText(1, QCoreApplication::translate("Dialog", "Kimura", nullptr));
        comboBox_distance_model->setItemText(2, QCoreApplication::translate("Dialog", "Jukes-Cantor", nullptr));
        comboBox_distance_model->setItemText(3, QCoreApplication::translate("Dialog", "LogDet", nullptr));

        label->setText(QCoreApplication::translate("Dialog", "Bootstrap", nullptr));
        label_4->setText(QCoreApplication::translate("Dialog", "Step", nullptr));
        label_2->setText(QCoreApplication::translate("Dialog", "Tree Model", nullptr));
        groupBox_2->setTitle(QCoreApplication::translate("Dialog", "Plot Refresh Rate", nullptr));
        radioButton_refresh_always->setText(QCoreApplication::translate("Dialog", "Every iteration (slowest)", nullptr));
        radioButton_refresh_10->setText(QCoreApplication::translate("Dialog", "Every 10 iterations", nullptr));
        radioButton_refresh_100->setText(QCoreApplication::translate("Dialog", "Every 100 iterations", nullptr));
        radioButton_refresh_never->setText(QCoreApplication::translate("Dialog", "Never (fastest)", nullptr));
        radioButton_consense->setText(QCoreApplication::translate("Dialog", "Save consense output \n"
"to input file location", nullptr));
    } // retranslateUi

};

namespace Ui {
    class Dialog: public Ui_Dialog {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_BOOTSCAN_DIALOG_H
