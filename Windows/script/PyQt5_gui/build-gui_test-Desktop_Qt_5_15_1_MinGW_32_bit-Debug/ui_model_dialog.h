/********************************************************************************
** Form generated from reading UI file 'model_dialog.ui'
**
** Created by: Qt User Interface Compiler version 5.15.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MODEL_DIALOG_H
#define UI_MODEL_DIALOG_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QDoubleSpinBox>
#include <QtWidgets/QFrame>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QRadioButton>
#include <QtWidgets/QSpinBox>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_model_dialog
{
public:
    QDialogButtonBox *buttonBox;
    QGroupBox *groupBox;
    QVBoxLayout *verticalLayout_2;
    QWidget *widget;
    QPushButton *btn_data_dna;
    QPushButton *btn_data_protein;
    QFrame *frame;
    QGridLayout *gridLayout;
    QLabel *label_6;
    QSpinBox *spinBox_step;
    QLabel *label_3;
    QLabel *label_4;
    QLabel *label_5;
    QComboBox *comboBox_models;
    QSpinBox *spinBox_window;
    QRadioButton *radioButton_2_manually;
    QRadioButton *radioButton_auto;
    QLabel *label_2;
    QDoubleSpinBox *Spin_Box_Gap;
    QDoubleSpinBox *SpinBox_param_a;
    QFrame *frame_2;
    QVBoxLayout *verticalLayout;
    QGroupBox *groupBox_2;
    QVBoxLayout *verticalLayout_4;
    QRadioButton *radioButton_refresh_always;
    QRadioButton *radioButton_refresh_10;
    QRadioButton *radioButton_refresh_100;
    QRadioButton *radioButton_refresh_never;
    QFrame *frame_3;
    QVBoxLayout *verticalLayout_3;
    QLabel *label;
    QComboBox *comboBox_refseq;
    QFrame *frame_4;
    QComboBox *comboBox_strip_gap;
    QLabel *label_7;

    void setupUi(QDialog *model_dialog)
    {
        if (model_dialog->objectName().isEmpty())
            model_dialog->setObjectName(QString::fromUtf8("model_dialog"));
        model_dialog->resize(454, 300);
        buttonBox = new QDialogButtonBox(model_dialog);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setGeometry(QRect(30, 260, 391, 32));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);
        groupBox = new QGroupBox(model_dialog);
        groupBox->setObjectName(QString::fromUtf8("groupBox"));
        groupBox->setGeometry(QRect(30, 20, 231, 241));
        verticalLayout_2 = new QVBoxLayout(groupBox);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        widget = new QWidget(groupBox);
        widget->setObjectName(QString::fromUtf8("widget"));
        btn_data_dna = new QPushButton(widget);
        btn_data_dna->setObjectName(QString::fromUtf8("btn_data_dna"));
        btn_data_dna->setGeometry(QRect(10, 10, 75, 23));
        btn_data_dna->setCheckable(true);
        btn_data_dna->setChecked(true);
        btn_data_protein = new QPushButton(widget);
        btn_data_protein->setObjectName(QString::fromUtf8("btn_data_protein"));
        btn_data_protein->setGeometry(QRect(80, 10, 75, 23));
        btn_data_protein->setCheckable(true);
        frame = new QFrame(widget);
        frame->setObjectName(QString::fromUtf8("frame"));
        frame->setGeometry(QRect(0, 30, 211, 181));
        frame->setFrameShape(QFrame::StyledPanel);
        frame->setFrameShadow(QFrame::Raised);
        gridLayout = new QGridLayout(frame);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        label_6 = new QLabel(frame);
        label_6->setObjectName(QString::fromUtf8("label_6"));
        label_6->setAlignment(Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter);

        gridLayout->addWidget(label_6, 4, 0, 1, 1);

        spinBox_step = new QSpinBox(frame);
        spinBox_step->setObjectName(QString::fromUtf8("spinBox_step"));
        spinBox_step->setMaximumSize(QSize(50, 20));
        spinBox_step->setMinimum(10);
        spinBox_step->setMaximum(200);
        spinBox_step->setSingleStep(10);
        spinBox_step->setValue(20);

        gridLayout->addWidget(spinBox_step, 2, 2, 1, 1);

        label_3 = new QLabel(frame);
        label_3->setObjectName(QString::fromUtf8("label_3"));
        label_3->setAlignment(Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter);

        gridLayout->addWidget(label_3, 1, 0, 1, 2);

        label_4 = new QLabel(frame);
        label_4->setObjectName(QString::fromUtf8("label_4"));
        label_4->setAlignment(Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter);

        gridLayout->addWidget(label_4, 2, 0, 1, 2);

        label_5 = new QLabel(frame);
        label_5->setObjectName(QString::fromUtf8("label_5"));
        label_5->setAlignment(Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter);

        gridLayout->addWidget(label_5, 3, 0, 1, 1);

        comboBox_models = new QComboBox(frame);
        comboBox_models->addItem(QString());
        comboBox_models->addItem(QString());
        comboBox_models->addItem(QString());
        comboBox_models->setObjectName(QString::fromUtf8("comboBox_models"));

        gridLayout->addWidget(comboBox_models, 0, 2, 1, 1);

        spinBox_window = new QSpinBox(frame);
        spinBox_window->setObjectName(QString::fromUtf8("spinBox_window"));
        spinBox_window->setMaximumSize(QSize(50, 20));
        spinBox_window->setProperty("showGroupSeparator", QVariant(false));
        spinBox_window->setMinimum(20);
        spinBox_window->setMaximum(1000);
        spinBox_window->setSingleStep(20);
        spinBox_window->setValue(200);

        gridLayout->addWidget(spinBox_window, 1, 2, 1, 1);

        radioButton_2_manually = new QRadioButton(frame);
        radioButton_2_manually->setObjectName(QString::fromUtf8("radioButton_2_manually"));

        gridLayout->addWidget(radioButton_2_manually, 6, 2, 1, 1);

        radioButton_auto = new QRadioButton(frame);
        radioButton_auto->setObjectName(QString::fromUtf8("radioButton_auto"));
        radioButton_auto->setLayoutDirection(Qt::LeftToRight);

        gridLayout->addWidget(radioButton_auto, 6, 0, 1, 1);

        label_2 = new QLabel(frame);
        label_2->setObjectName(QString::fromUtf8("label_2"));
        label_2->setAlignment(Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter);

        gridLayout->addWidget(label_2, 0, 0, 1, 1);

        Spin_Box_Gap = new QDoubleSpinBox(frame);
        Spin_Box_Gap->setObjectName(QString::fromUtf8("Spin_Box_Gap"));
        Spin_Box_Gap->setMaximumSize(QSize(50, 20));
        Spin_Box_Gap->setDecimals(1);
        Spin_Box_Gap->setMinimum(-100.000000000000000);

        gridLayout->addWidget(Spin_Box_Gap, 3, 2, 1, 1);

        SpinBox_param_a = new QDoubleSpinBox(frame);
        SpinBox_param_a->setObjectName(QString::fromUtf8("SpinBox_param_a"));
        SpinBox_param_a->setMinimumSize(QSize(50, 0));
        SpinBox_param_a->setMaximumSize(QSize(50, 20));
        SpinBox_param_a->setButtonSymbols(QAbstractSpinBox::UpDownArrows);
        SpinBox_param_a->setDecimals(1);
        SpinBox_param_a->setMinimum(0.000000000000000);
        SpinBox_param_a->setMaximum(100.000000000000000);
        SpinBox_param_a->setValue(0.000000000000000);

        gridLayout->addWidget(SpinBox_param_a, 4, 2, 1, 1);


        verticalLayout_2->addWidget(widget);

        frame_2 = new QFrame(model_dialog);
        frame_2->setObjectName(QString::fromUtf8("frame_2"));
        frame_2->setGeometry(QRect(270, 20, 161, 111));
        frame_2->setFrameShape(QFrame::StyledPanel);
        frame_2->setFrameShadow(QFrame::Raised);
        verticalLayout = new QVBoxLayout(frame_2);
        verticalLayout->setSpacing(0);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        verticalLayout->setContentsMargins(0, 0, 0, 0);
        groupBox_2 = new QGroupBox(frame_2);
        groupBox_2->setObjectName(QString::fromUtf8("groupBox_2"));
        verticalLayout_4 = new QVBoxLayout(groupBox_2);
        verticalLayout_4->setObjectName(QString::fromUtf8("verticalLayout_4"));
        radioButton_refresh_always = new QRadioButton(groupBox_2);
        radioButton_refresh_always->setObjectName(QString::fromUtf8("radioButton_refresh_always"));

        verticalLayout_4->addWidget(radioButton_refresh_always);

        radioButton_refresh_10 = new QRadioButton(groupBox_2);
        radioButton_refresh_10->setObjectName(QString::fromUtf8("radioButton_refresh_10"));

        verticalLayout_4->addWidget(radioButton_refresh_10);

        radioButton_refresh_100 = new QRadioButton(groupBox_2);
        radioButton_refresh_100->setObjectName(QString::fromUtf8("radioButton_refresh_100"));

        verticalLayout_4->addWidget(radioButton_refresh_100);

        radioButton_refresh_never = new QRadioButton(groupBox_2);
        radioButton_refresh_never->setObjectName(QString::fromUtf8("radioButton_refresh_never"));

        verticalLayout_4->addWidget(radioButton_refresh_never);


        verticalLayout->addWidget(groupBox_2);

        frame_3 = new QFrame(model_dialog);
        frame_3->setObjectName(QString::fromUtf8("frame_3"));
        frame_3->setGeometry(QRect(270, 190, 161, 61));
        frame_3->setFrameShape(QFrame::StyledPanel);
        frame_3->setFrameShadow(QFrame::Raised);
        verticalLayout_3 = new QVBoxLayout(frame_3);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        label = new QLabel(frame_3);
        label->setObjectName(QString::fromUtf8("label"));

        verticalLayout_3->addWidget(label, 0, Qt::AlignHCenter);

        comboBox_refseq = new QComboBox(frame_3);
        comboBox_refseq->setObjectName(QString::fromUtf8("comboBox_refseq"));

        verticalLayout_3->addWidget(comboBox_refseq);

        frame_4 = new QFrame(model_dialog);
        frame_4->setObjectName(QString::fromUtf8("frame_4"));
        frame_4->setGeometry(QRect(270, 140, 161, 51));
        frame_4->setFrameShape(QFrame::StyledPanel);
        frame_4->setFrameShadow(QFrame::Raised);
        comboBox_strip_gap = new QComboBox(frame_4);
        comboBox_strip_gap->addItem(QString());
        comboBox_strip_gap->addItem(QString());
        comboBox_strip_gap->addItem(QString());
        comboBox_strip_gap->addItem(QString());
        comboBox_strip_gap->addItem(QString());
        comboBox_strip_gap->addItem(QString());
        comboBox_strip_gap->addItem(QString());
        comboBox_strip_gap->setObjectName(QString::fromUtf8("comboBox_strip_gap"));
        comboBox_strip_gap->setGeometry(QRect(20, 20, 101, 22));
        label_7 = new QLabel(frame_4);
        label_7->setObjectName(QString::fromUtf8("label_7"));
        label_7->setGeometry(QRect(50, 0, 71, 16));

        retranslateUi(model_dialog);
        QObject::connect(buttonBox, SIGNAL(accepted()), model_dialog, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), model_dialog, SLOT(reject()));

        QMetaObject::connectSlotsByName(model_dialog);
    } // setupUi

    void retranslateUi(QDialog *model_dialog)
    {
        model_dialog->setWindowTitle(QCoreApplication::translate("model_dialog", "Simplot Settings", nullptr));
        groupBox->setTitle(QCoreApplication::translate("model_dialog", "Model", nullptr));
        btn_data_dna->setText(QCoreApplication::translate("model_dialog", "DNA", nullptr));
        btn_data_protein->setText(QCoreApplication::translate("model_dialog", "Protein", nullptr));
        label_6->setText(QCoreApplication::translate("model_dialog", "<html><head/><body><p>Parameter \316\261</p></body></html>", nullptr));
        label_3->setText(QCoreApplication::translate("model_dialog", "Window length", nullptr));
        label_4->setText(QCoreApplication::translate("model_dialog", "Step", nullptr));
        label_5->setText(QCoreApplication::translate("model_dialog", "Gap Penalty", nullptr));
        comboBox_models->setItemText(0, QCoreApplication::translate("model_dialog", "Kimura2Parameter", nullptr));
        comboBox_models->setItemText(1, QCoreApplication::translate("model_dialog", "New Item 2", nullptr));
        comboBox_models->setItemText(2, QCoreApplication::translate("model_dialog", "New Item 3", nullptr));

        radioButton_2_manually->setText(QCoreApplication::translate("model_dialog", "Manually", nullptr));
        radioButton_auto->setText(QCoreApplication::translate("model_dialog", "Auto", nullptr));
        label_2->setText(QCoreApplication::translate("model_dialog", "Model", nullptr));
        groupBox_2->setTitle(QCoreApplication::translate("model_dialog", "Plot Refresh Rate", nullptr));
        radioButton_refresh_always->setText(QCoreApplication::translate("model_dialog", "Every iteration (slowest)", nullptr));
        radioButton_refresh_10->setText(QCoreApplication::translate("model_dialog", "Every 10 iterations", nullptr));
        radioButton_refresh_100->setText(QCoreApplication::translate("model_dialog", "Every 100 iterations", nullptr));
        radioButton_refresh_never->setText(QCoreApplication::translate("model_dialog", "Never", nullptr));
        label->setText(QCoreApplication::translate("model_dialog", "Select Refseq", nullptr));
        comboBox_strip_gap->setItemText(0, QCoreApplication::translate("model_dialog", "No Strip Gap", nullptr));
        comboBox_strip_gap->setItemText(1, QCoreApplication::translate("model_dialog", "25%", nullptr));
        comboBox_strip_gap->setItemText(2, QCoreApplication::translate("model_dialog", "33%", nullptr));
        comboBox_strip_gap->setItemText(3, QCoreApplication::translate("model_dialog", "50%", nullptr));
        comboBox_strip_gap->setItemText(4, QCoreApplication::translate("model_dialog", "66%", nullptr));
        comboBox_strip_gap->setItemText(5, QCoreApplication::translate("model_dialog", "75%", nullptr));
        comboBox_strip_gap->setItemText(6, QCoreApplication::translate("model_dialog", "100%", nullptr));

        label_7->setText(QCoreApplication::translate("model_dialog", "Strip gap", nullptr));
    } // retranslateUi

};

namespace Ui {
    class model_dialog: public Ui_model_dialog {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MODEL_DIALOG_H
