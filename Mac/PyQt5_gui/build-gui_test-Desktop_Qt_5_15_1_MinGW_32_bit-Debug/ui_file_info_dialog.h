/********************************************************************************
** Form generated from reading UI file 'file_info_dialog.ui'
**
** Created by: Qt User Interface Compiler version 5.15.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_FILE_INFO_DIALOG_H
#define UI_FILE_INFO_DIALOG_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_Dialog
{
public:
    QDialogButtonBox *buttonBox;
    QWidget *horizontalLayoutWidget;
    QHBoxLayout *horizontalLayout;
    QSpacerItem *horizontalSpacer_2;
    QLabel *label_2;
    QComboBox *comboBox_format;
    QSpacerItem *horizontalSpacer;
    QLabel *label_3;
    QComboBox *comboBox_datatype;
    QSpacerItem *horizontalSpacer_3;
    QLabel *label;

    void setupUi(QDialog *Dialog)
    {
        if (Dialog->objectName().isEmpty())
            Dialog->setObjectName(QString::fromUtf8("Dialog"));
        Dialog->resize(502, 213);
        buttonBox = new QDialogButtonBox(Dialog);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setGeometry(QRect(100, 170, 341, 32));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);
        horizontalLayoutWidget = new QWidget(Dialog);
        horizontalLayoutWidget->setObjectName(QString::fromUtf8("horizontalLayoutWidget"));
        horizontalLayoutWidget->setGeometry(QRect(0, 100, 517, 41));
        horizontalLayout = new QHBoxLayout(horizontalLayoutWidget);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        horizontalSpacer_2 = new QSpacerItem(80, 20, QSizePolicy::Fixed, QSizePolicy::Minimum);

        horizontalLayout->addItem(horizontalSpacer_2);

        label_2 = new QLabel(horizontalLayoutWidget);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        horizontalLayout->addWidget(label_2);

        comboBox_format = new QComboBox(horizontalLayoutWidget);
        comboBox_format->addItem(QString());
        comboBox_format->addItem(QString());
        comboBox_format->setObjectName(QString::fromUtf8("comboBox_format"));

        horizontalLayout->addWidget(comboBox_format);

        horizontalSpacer = new QSpacerItem(100, 20, QSizePolicy::Fixed, QSizePolicy::Minimum);

        horizontalLayout->addItem(horizontalSpacer);

        label_3 = new QLabel(horizontalLayoutWidget);
        label_3->setObjectName(QString::fromUtf8("label_3"));

        horizontalLayout->addWidget(label_3);

        comboBox_datatype = new QComboBox(horizontalLayoutWidget);
        comboBox_datatype->addItem(QString());
        comboBox_datatype->addItem(QString());
        comboBox_datatype->setObjectName(QString::fromUtf8("comboBox_datatype"));

        horizontalLayout->addWidget(comboBox_datatype);

        horizontalSpacer_3 = new QSpacerItem(80, 20, QSizePolicy::Fixed, QSizePolicy::Minimum);

        horizontalLayout->addItem(horizontalSpacer_3);

        label = new QLabel(Dialog);
        label->setObjectName(QString::fromUtf8("label"));
        label->setGeometry(QRect(11, 11, 491, 66));

        retranslateUi(Dialog);
        QObject::connect(buttonBox, SIGNAL(accepted()), Dialog, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), Dialog, SLOT(reject()));

        QMetaObject::connectSlotsByName(Dialog);
    } // setupUi

    void retranslateUi(QDialog *Dialog)
    {
        Dialog->setWindowTitle(QCoreApplication::translate("Dialog", "File Format Finder", nullptr));
        label_2->setText(QCoreApplication::translate("Dialog", "<html><head/><body><p>File format:</p></body></html>", nullptr));
        comboBox_format->setItemText(0, QCoreApplication::translate("Dialog", "fasta", nullptr));
        comboBox_format->setItemText(1, QCoreApplication::translate("Dialog", "nexus", nullptr));

        label_3->setText(QCoreApplication::translate("Dialog", "<html><head/><body><p>Datatype:</p></body></html>", nullptr));
        comboBox_datatype->setItemText(0, QCoreApplication::translate("Dialog", "DNA", nullptr));
        comboBox_datatype->setItemText(1, QCoreApplication::translate("Dialog", "protein", nullptr));

        label->setText(QCoreApplication::translate("Dialog", "<html><head/><body><p><span style=\" font-size:10pt; font-weight:600;\">The file format and/or datatype could not be detetcted adequately.</span></p><p>If you are sure that your file is parseable by biopython, enter the file fomrat and datatype manually</p><p>Otherwise, press cancel to return to the main window.</p></body></html>", nullptr));
    } // retranslateUi

};

namespace Ui {
    class Dialog: public Ui_Dialog {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_FILE_INFO_DIALOG_H
