/********************************************************************************
** Form generated from reading UI file 'seq_window.ui'
**
** Created by: Qt User Interface Compiler version 5.15.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_SEQ_WINDOW_H
#define UI_SEQ_WINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QListWidget>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_Seq_window
{
public:
    QDialogButtonBox *buttonBox;
    QWidget *horizontalLayoutWidget;
    QHBoxLayout *horizontalLayout;
    QListWidget *seqOutput;
    QVBoxLayout *verticalLayout_2;
    QPushButton *mBtnMoveToSelected;
    QPushButton *mButtonToAvailable;
    QPushButton *mBtnMoveToAvailable;
    QPushButton *mButtonToSelected;
    QListWidget *seqInput;
    QWidget *horizontalLayoutWidget_2;
    QHBoxLayout *horizontalLayout_2;
    QLabel *label_2;
    QLabel *label;

    void setupUi(QDialog *Seq_window)
    {
        if (Seq_window->objectName().isEmpty())
            Seq_window->setObjectName(QString::fromUtf8("Seq_window"));
        Seq_window->resize(958, 411);
        buttonBox = new QDialogButtonBox(Seq_window);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setGeometry(QRect(280, 370, 341, 32));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);
        horizontalLayoutWidget = new QWidget(Seq_window);
        horizontalLayoutWidget->setObjectName(QString::fromUtf8("horizontalLayoutWidget"));
        horizontalLayoutWidget->setGeometry(QRect(30, 90, 901, 261));
        horizontalLayout = new QHBoxLayout(horizontalLayoutWidget);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        seqOutput = new QListWidget(horizontalLayoutWidget);
        seqOutput->setObjectName(QString::fromUtf8("seqOutput"));

        horizontalLayout->addWidget(seqOutput);

        verticalLayout_2 = new QVBoxLayout();
        verticalLayout_2->setSpacing(1);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        verticalLayout_2->setContentsMargins(-1, 20, -1, 20);
        mBtnMoveToSelected = new QPushButton(horizontalLayoutWidget);
        mBtnMoveToSelected->setObjectName(QString::fromUtf8("mBtnMoveToSelected"));

        verticalLayout_2->addWidget(mBtnMoveToSelected);

        mButtonToAvailable = new QPushButton(horizontalLayoutWidget);
        mButtonToAvailable->setObjectName(QString::fromUtf8("mButtonToAvailable"));

        verticalLayout_2->addWidget(mButtonToAvailable);

        mBtnMoveToAvailable = new QPushButton(horizontalLayoutWidget);
        mBtnMoveToAvailable->setObjectName(QString::fromUtf8("mBtnMoveToAvailable"));

        verticalLayout_2->addWidget(mBtnMoveToAvailable);

        mButtonToSelected = new QPushButton(horizontalLayoutWidget);
        mButtonToSelected->setObjectName(QString::fromUtf8("mButtonToSelected"));

        verticalLayout_2->addWidget(mButtonToSelected);


        horizontalLayout->addLayout(verticalLayout_2);

        seqInput = new QListWidget(horizontalLayoutWidget);
        seqInput->setObjectName(QString::fromUtf8("seqInput"));

        horizontalLayout->addWidget(seqInput);

        horizontalLayoutWidget_2 = new QWidget(Seq_window);
        horizontalLayoutWidget_2->setObjectName(QString::fromUtf8("horizontalLayoutWidget_2"));
        horizontalLayoutWidget_2->setGeometry(QRect(30, 29, 891, 51));
        horizontalLayout_2 = new QHBoxLayout(horizontalLayoutWidget_2);
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        horizontalLayout_2->setContentsMargins(0, 0, 0, 0);
        label_2 = new QLabel(horizontalLayoutWidget_2);
        label_2->setObjectName(QString::fromUtf8("label_2"));
        label_2->setAlignment(Qt::AlignCenter);

        horizontalLayout_2->addWidget(label_2);

        label = new QLabel(horizontalLayoutWidget_2);
        label->setObjectName(QString::fromUtf8("label"));
        label->setAlignment(Qt::AlignCenter);

        horizontalLayout_2->addWidget(label);


        retranslateUi(Seq_window);
        QObject::connect(buttonBox, SIGNAL(accepted()), Seq_window, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), Seq_window, SLOT(reject()));

        QMetaObject::connectSlotsByName(Seq_window);
    } // setupUi

    void retranslateUi(QDialog *Seq_window)
    {
        Seq_window->setWindowTitle(QCoreApplication::translate("Seq_window", "Group Editor", nullptr));
        mBtnMoveToSelected->setText(QCoreApplication::translate("Seq_window", ">>", nullptr));
        mButtonToAvailable->setText(QCoreApplication::translate("Seq_window", ">", nullptr));
        mBtnMoveToAvailable->setText(QCoreApplication::translate("Seq_window", "<", nullptr));
        mButtonToSelected->setText(QCoreApplication::translate("Seq_window", "<<", nullptr));
        label_2->setText(QCoreApplication::translate("Seq_window", "Group", nullptr));
        label->setText(QCoreApplication::translate("Seq_window", "Sequences", nullptr));
    } // retranslateUi

};

namespace Ui {
    class Seq_window: public Ui_Seq_window {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_SEQ_WINDOW_H
