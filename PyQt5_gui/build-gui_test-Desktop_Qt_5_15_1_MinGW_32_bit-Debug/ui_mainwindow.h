/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.15.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtGui/QIcon>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QFrame>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QListWidget>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QPlainTextEdit>
#include <QtWidgets/QProgressBar>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QStackedWidget>
#include <QtWidgets/QTextBrowser>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QWidget *centralwidget;
    QVBoxLayout *verticalLayout;
    QFrame *top_bar;
    QHBoxLayout *horizontalLayout_4;
    QFrame *frame_2;
    QHBoxLayout *horizontalLayout_5;
    QSpacerItem *horizontalSpacer;
    QPushButton *Btn_group_page;
    QPushButton *Btn_simplot_page;
    QPushButton *Btn_bootstrap_page;
    QPushButton *Btn_findSites;
    QPushButton *Btn_simplot_network;
    QFrame *content;
    QHBoxLayout *horizontalLayout;
    QFrame *frame_pages;
    QVBoxLayout *verticalLayout_2;
    QProgressBar *progressBar_global;
    QStackedWidget *Pages_Widget;
    QWidget *group_page;
    QVBoxLayout *verticalLayout_3;
    QFrame *frame;
    QHBoxLayout *horizontalLayout_2;
    QFrame *page_1_option_bar;
    QVBoxLayout *verticalLayout_6;
    QPushButton *Btn_File_Browser;
    QPushButton *Btn_reopen;
    QPushButton *Btn_save_nexus;
    QSpacerItem *verticalSpacer_5;
    QFrame *frame_3;
    QHBoxLayout *horizontalLayout_3;
    QFrame *frame_4;
    QVBoxLayout *verticalLayout_4;
    QLabel *label;
    QListWidget *listWidget_groups;
    QFrame *frame_5;
    QVBoxLayout *verticalLayout_5;
    QSpacerItem *verticalSpacer;
    QPushButton *Btn_add;
    QPushButton *Btn_del;
    QPushButton *Btn_edit;
    QPushButton *Btn_modify_groups;
    QFrame *frame_14;
    QVBoxLayout *verticalLayout_20;
    QTextBrowser *TextBrowser_group_page;
    QWidget *simplot_page;
    QVBoxLayout *verticalLayout_7;
    QFrame *frame_6;
    QHBoxLayout *horizontalLayout_6;
    QFrame *Disploter_option_bar;
    QVBoxLayout *verticalLayout_8;
    QPushButton *Btn_start_simplot;
    QPushButton *Btn_model_settings;
    QPushButton *Btn_plot_window;
    QGroupBox *groupBox_3;
    QVBoxLayout *verticalLayout_22;
    QComboBox *comboBox_simplot_refseq;
    QSpacerItem *verticalSpacer_2;
    QFrame *frame_8;
    QVBoxLayout *verticalLayout_9;
    QVBoxLayout *verticalLayout_10;
    QWidget *bootscan_page;
    QVBoxLayout *verticalLayout_16;
    QFrame *frame_7;
    QHBoxLayout *horizontalLayout_7;
    QFrame *Disploter_option_bar_2;
    QVBoxLayout *verticalLayout_15;
    QPushButton *Btn_start_bootscan;
    QPushButton *Btn_bootscan_settings;
    QPushButton *Btn_plot_window_bootscan;
    QGroupBox *groupBox;
    QVBoxLayout *verticalLayout_11;
    QComboBox *comboBox_Bootscan_refseq;
    QSpacerItem *verticalSpacer_3;
    QFrame *frame_9;
    QVBoxLayout *verticalLayout_13;
    QVBoxLayout *verticalLayout_14;
    QWidget *findSites_page;
    QVBoxLayout *verticalLayout_12;
    QFrame *frame_10;
    QVBoxLayout *verticalLayout_17;
    QFrame *frame_11;
    QHBoxLayout *horizontalLayout_8;
    QGroupBox *groupBox_2;
    QGridLayout *gridLayout;
    QComboBox *comboBox_ref1;
    QComboBox *comboBox_query;
    QComboBox *comboBox_ref2;
    QComboBox *comboBox_outgroup;
    QLabel *label_2;
    QLabel *label_3;
    QLabel *label_4;
    QLabel *label_5;
    QFrame *frame_13;
    QVBoxLayout *verticalLayout_19;
    QPushButton *Btn_begin_findSites;
    QPushButton *Btn_save_findSite;
    QPushButton *Btn_reset_findSite;
    QFrame *frame_12;
    QVBoxLayout *verticalLayout_18;
    QPlainTextEdit *findSite_output_browser;
    QWidget *network_page;
    QVBoxLayout *verticalLayout_24;
    QFrame *frame_15;
    QHBoxLayout *horizontalLayout_9;
    QFrame *Disploter_option_bar_3;
    QVBoxLayout *verticalLayout_21;
    QPushButton *Btn_start_sp_network;
    QPushButton *Btn_network_settings;
    QPushButton *Btn_save_html;
    QSpacerItem *verticalSpacer_4;
    QFrame *frame_16;
    QHBoxLayout *horizontalLayout_10;
    QVBoxLayout *Vlayout_network;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QString::fromUtf8("MainWindow"));
        MainWindow->resize(950, 575);
        MainWindow->setMinimumSize(QSize(750, 450));
        MainWindow->setStyleSheet(QString::fromUtf8("background-color: rgb(248, 249, 250);"));
        centralwidget = new QWidget(MainWindow);
        centralwidget->setObjectName(QString::fromUtf8("centralwidget"));
        verticalLayout = new QVBoxLayout(centralwidget);
        verticalLayout->setSpacing(0);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        verticalLayout->setContentsMargins(0, 0, 0, 0);
        top_bar = new QFrame(centralwidget);
        top_bar->setObjectName(QString::fromUtf8("top_bar"));
        top_bar->setMinimumSize(QSize(0, 55));
        top_bar->setMaximumSize(QSize(16777215, 50));
        top_bar->setStyleSheet(QString::fromUtf8("background-color: rgb(173, 181, 189);"));
        top_bar->setFrameShape(QFrame::NoFrame);
        top_bar->setFrameShadow(QFrame::Raised);
        horizontalLayout_4 = new QHBoxLayout(top_bar);
        horizontalLayout_4->setSpacing(0);
        horizontalLayout_4->setObjectName(QString::fromUtf8("horizontalLayout_4"));
        horizontalLayout_4->setContentsMargins(0, 0, 0, 0);
        frame_2 = new QFrame(top_bar);
        frame_2->setObjectName(QString::fromUtf8("frame_2"));
        frame_2->setFrameShape(QFrame::NoFrame);
        frame_2->setFrameShadow(QFrame::Raised);
        horizontalLayout_5 = new QHBoxLayout(frame_2);
        horizontalLayout_5->setSpacing(1);
        horizontalLayout_5->setObjectName(QString::fromUtf8("horizontalLayout_5"));
        horizontalLayout_5->setContentsMargins(0, 0, 0, 0);
        horizontalSpacer = new QSpacerItem(81, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_5->addItem(horizontalSpacer);

        Btn_group_page = new QPushButton(frame_2);
        Btn_group_page->setObjectName(QString::fromUtf8("Btn_group_page"));
        QSizePolicy sizePolicy(QSizePolicy::Fixed, QSizePolicy::Fixed);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(Btn_group_page->sizePolicy().hasHeightForWidth());
        Btn_group_page->setSizePolicy(sizePolicy);
        Btn_group_page->setMinimumSize(QSize(125, 50));
        QFont font;
        font.setPointSize(10);
        Btn_group_page->setFont(font);
        Btn_group_page->setStyleSheet(QString::fromUtf8("background-color: rgb(173, 181, 189);\n"
"border: 0px;"));
        Btn_group_page->setAutoDefault(false);
        Btn_group_page->setFlat(false);

        horizontalLayout_5->addWidget(Btn_group_page);

        Btn_simplot_page = new QPushButton(frame_2);
        Btn_simplot_page->setObjectName(QString::fromUtf8("Btn_simplot_page"));
        sizePolicy.setHeightForWidth(Btn_simplot_page->sizePolicy().hasHeightForWidth());
        Btn_simplot_page->setSizePolicy(sizePolicy);
        Btn_simplot_page->setMinimumSize(QSize(125, 50));
        Btn_simplot_page->setFont(font);
        Btn_simplot_page->setStyleSheet(QString::fromUtf8("background-color: rgb(173, 181, 189);\n"
"border: 0px;"));

        horizontalLayout_5->addWidget(Btn_simplot_page);

        Btn_bootstrap_page = new QPushButton(frame_2);
        Btn_bootstrap_page->setObjectName(QString::fromUtf8("Btn_bootstrap_page"));
        sizePolicy.setHeightForWidth(Btn_bootstrap_page->sizePolicy().hasHeightForWidth());
        Btn_bootstrap_page->setSizePolicy(sizePolicy);
        Btn_bootstrap_page->setMinimumSize(QSize(125, 50));
        Btn_bootstrap_page->setFont(font);
        Btn_bootstrap_page->setStyleSheet(QString::fromUtf8("background-color: rgb(173, 181, 189);\n"
"border: 0px;"));

        horizontalLayout_5->addWidget(Btn_bootstrap_page);

        Btn_findSites = new QPushButton(frame_2);
        Btn_findSites->setObjectName(QString::fromUtf8("Btn_findSites"));
        sizePolicy.setHeightForWidth(Btn_findSites->sizePolicy().hasHeightForWidth());
        Btn_findSites->setSizePolicy(sizePolicy);
        Btn_findSites->setMinimumSize(QSize(125, 50));
        Btn_findSites->setFont(font);
        Btn_findSites->setStyleSheet(QString::fromUtf8("background-color: rgb(173, 181, 189);\n"
"border: 0px;"));

        horizontalLayout_5->addWidget(Btn_findSites);

        Btn_simplot_network = new QPushButton(frame_2);
        Btn_simplot_network->setObjectName(QString::fromUtf8("Btn_simplot_network"));
        sizePolicy.setHeightForWidth(Btn_simplot_network->sizePolicy().hasHeightForWidth());
        Btn_simplot_network->setSizePolicy(sizePolicy);
        Btn_simplot_network->setMinimumSize(QSize(125, 50));
        Btn_simplot_network->setFont(font);
        Btn_simplot_network->setStyleSheet(QString::fromUtf8("background-color: rgb(173, 181, 189);\n"
"border: 0px;"));

        horizontalLayout_5->addWidget(Btn_simplot_network);


        horizontalLayout_4->addWidget(frame_2, 0, Qt::AlignLeft);


        verticalLayout->addWidget(top_bar);

        content = new QFrame(centralwidget);
        content->setObjectName(QString::fromUtf8("content"));
        content->setFrameShape(QFrame::NoFrame);
        content->setFrameShadow(QFrame::Raised);
        horizontalLayout = new QHBoxLayout(content);
        horizontalLayout->setSpacing(0);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        frame_pages = new QFrame(content);
        frame_pages->setObjectName(QString::fromUtf8("frame_pages"));
        frame_pages->setFrameShape(QFrame::NoFrame);
        frame_pages->setFrameShadow(QFrame::Raised);
        verticalLayout_2 = new QVBoxLayout(frame_pages);
        verticalLayout_2->setSpacing(0);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        verticalLayout_2->setContentsMargins(0, 0, 0, 0);
        progressBar_global = new QProgressBar(frame_pages);
        progressBar_global->setObjectName(QString::fromUtf8("progressBar_global"));
        progressBar_global->setMaximumSize(QSize(16777215, 9));
        progressBar_global->setAutoFillBackground(false);
        progressBar_global->setStyleSheet(QString::fromUtf8("QProgressBar {\n"
"     border: 3px;\n"
"     border-radius: 1px;\n"
"	background-color: rgb(173, 181, 189)\n"
" }\n"
" QProgressBar::chunk {\n"
"     background-color: rgb(184, 94, 95);\n"
" }"));
        progressBar_global->setValue(0);
        progressBar_global->setTextVisible(false);
        progressBar_global->setInvertedAppearance(false);

        verticalLayout_2->addWidget(progressBar_global);

        Pages_Widget = new QStackedWidget(frame_pages);
        Pages_Widget->setObjectName(QString::fromUtf8("Pages_Widget"));
        group_page = new QWidget();
        group_page->setObjectName(QString::fromUtf8("group_page"));
        verticalLayout_3 = new QVBoxLayout(group_page);
        verticalLayout_3->setSpacing(0);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        verticalLayout_3->setContentsMargins(0, 0, 0, 0);
        frame = new QFrame(group_page);
        frame->setObjectName(QString::fromUtf8("frame"));
        frame->setFrameShape(QFrame::NoFrame);
        frame->setFrameShadow(QFrame::Raised);
        horizontalLayout_2 = new QHBoxLayout(frame);
        horizontalLayout_2->setSpacing(0);
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        horizontalLayout_2->setContentsMargins(0, 0, 0, 0);
        page_1_option_bar = new QFrame(frame);
        page_1_option_bar->setObjectName(QString::fromUtf8("page_1_option_bar"));
        page_1_option_bar->setMaximumSize(QSize(81, 16777215));
        page_1_option_bar->setStyleSheet(QString::fromUtf8("background-color: rgb(206, 212, 218);"));
        page_1_option_bar->setFrameShape(QFrame::NoFrame);
        page_1_option_bar->setFrameShadow(QFrame::Raised);
        verticalLayout_6 = new QVBoxLayout(page_1_option_bar);
        verticalLayout_6->setSpacing(1);
        verticalLayout_6->setObjectName(QString::fromUtf8("verticalLayout_6"));
        verticalLayout_6->setContentsMargins(0, 0, 0, 0);
        Btn_File_Browser = new QPushButton(page_1_option_bar);
        Btn_File_Browser->setObjectName(QString::fromUtf8("Btn_File_Browser"));
        sizePolicy.setHeightForWidth(Btn_File_Browser->sizePolicy().hasHeightForWidth());
        Btn_File_Browser->setSizePolicy(sizePolicy);
        Btn_File_Browser->setMinimumSize(QSize(80, 60));
        Btn_File_Browser->setFont(font);
        Btn_File_Browser->setStyleSheet(QString::fromUtf8("background-color: rgb(206, 212, 218);\n"
"border: 0px;"));
        QIcon icon;
        icon.addFile(QString::fromUtf8("../../Downloads/icons8-browse-folder-100.png"), QSize(), QIcon::Normal, QIcon::Off);
        Btn_File_Browser->setIcon(icon);
        Btn_File_Browser->setIconSize(QSize(50, 50));

        verticalLayout_6->addWidget(Btn_File_Browser);

        Btn_reopen = new QPushButton(page_1_option_bar);
        Btn_reopen->setObjectName(QString::fromUtf8("Btn_reopen"));
        sizePolicy.setHeightForWidth(Btn_reopen->sizePolicy().hasHeightForWidth());
        Btn_reopen->setSizePolicy(sizePolicy);
        Btn_reopen->setMinimumSize(QSize(80, 60));
        Btn_reopen->setFont(font);
        Btn_reopen->setContextMenuPolicy(Qt::CustomContextMenu);
        Btn_reopen->setStyleSheet(QString::fromUtf8("background-color: rgb(206, 212, 218);\n"
"border: 0px;"));

        verticalLayout_6->addWidget(Btn_reopen);

        Btn_save_nexus = new QPushButton(page_1_option_bar);
        Btn_save_nexus->setObjectName(QString::fromUtf8("Btn_save_nexus"));
        sizePolicy.setHeightForWidth(Btn_save_nexus->sizePolicy().hasHeightForWidth());
        Btn_save_nexus->setSizePolicy(sizePolicy);
        Btn_save_nexus->setMinimumSize(QSize(80, 60));
        Btn_save_nexus->setFont(font);
        Btn_save_nexus->setStyleSheet(QString::fromUtf8("background-color: rgb(206, 212, 218);\n"
"border: 0px;"));

        verticalLayout_6->addWidget(Btn_save_nexus);

        verticalSpacer_5 = new QSpacerItem(20, 400, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_6->addItem(verticalSpacer_5);


        horizontalLayout_2->addWidget(page_1_option_bar, 0, Qt::AlignTop);

        frame_3 = new QFrame(frame);
        frame_3->setObjectName(QString::fromUtf8("frame_3"));
        frame_3->setFrameShape(QFrame::NoFrame);
        frame_3->setFrameShadow(QFrame::Raised);
        horizontalLayout_3 = new QHBoxLayout(frame_3);
        horizontalLayout_3->setSpacing(0);
        horizontalLayout_3->setObjectName(QString::fromUtf8("horizontalLayout_3"));
        horizontalLayout_3->setContentsMargins(0, 0, 0, 0);
        frame_4 = new QFrame(frame_3);
        frame_4->setObjectName(QString::fromUtf8("frame_4"));
        frame_4->setMaximumSize(QSize(275, 16777215));
        frame_4->setStyleSheet(QString::fromUtf8(""));
        frame_4->setFrameShape(QFrame::StyledPanel);
        frame_4->setFrameShadow(QFrame::Raised);
        verticalLayout_4 = new QVBoxLayout(frame_4);
        verticalLayout_4->setSpacing(0);
        verticalLayout_4->setObjectName(QString::fromUtf8("verticalLayout_4"));
        verticalLayout_4->setContentsMargins(10, 0, 10, 20);
        label = new QLabel(frame_4);
        label->setObjectName(QString::fromUtf8("label"));
        label->setMinimumSize(QSize(0, 20));
        label->setStyleSheet(QString::fromUtf8(""));
        label->setAlignment(Qt::AlignCenter);

        verticalLayout_4->addWidget(label);

        listWidget_groups = new QListWidget(frame_4);
        listWidget_groups->setObjectName(QString::fromUtf8("listWidget_groups"));
        listWidget_groups->setContextMenuPolicy(Qt::CustomContextMenu);
        listWidget_groups->setStyleSheet(QString::fromUtf8(""));

        verticalLayout_4->addWidget(listWidget_groups);


        horizontalLayout_3->addWidget(frame_4);

        frame_5 = new QFrame(frame_3);
        frame_5->setObjectName(QString::fromUtf8("frame_5"));
        QSizePolicy sizePolicy1(QSizePolicy::Preferred, QSizePolicy::Preferred);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(frame_5->sizePolicy().hasHeightForWidth());
        frame_5->setSizePolicy(sizePolicy1);
        frame_5->setMinimumSize(QSize(84, 250));
        frame_5->setStyleSheet(QString::fromUtf8(""));
        frame_5->setFrameShape(QFrame::StyledPanel);
        frame_5->setFrameShadow(QFrame::Raised);
        verticalLayout_5 = new QVBoxLayout(frame_5);
        verticalLayout_5->setSpacing(1);
        verticalLayout_5->setObjectName(QString::fromUtf8("verticalLayout_5"));
        verticalLayout_5->setContentsMargins(0, 2, 6, 2);
        verticalSpacer = new QSpacerItem(10, 8, QSizePolicy::Minimum, QSizePolicy::Fixed);

        verticalLayout_5->addItem(verticalSpacer);

        Btn_add = new QPushButton(frame_5);
        Btn_add->setObjectName(QString::fromUtf8("Btn_add"));
        Btn_add->setMinimumSize(QSize(75, 50));
        Btn_add->setFont(font);
        Btn_add->setStyleSheet(QString::fromUtf8(""));

        verticalLayout_5->addWidget(Btn_add);

        Btn_del = new QPushButton(frame_5);
        Btn_del->setObjectName(QString::fromUtf8("Btn_del"));
        Btn_del->setMinimumSize(QSize(75, 50));
        Btn_del->setFont(font);
        Btn_del->setStyleSheet(QString::fromUtf8(""));

        verticalLayout_5->addWidget(Btn_del);

        Btn_edit = new QPushButton(frame_5);
        Btn_edit->setObjectName(QString::fromUtf8("Btn_edit"));
        Btn_edit->setMinimumSize(QSize(75, 50));
        Btn_edit->setFont(font);
        Btn_edit->setStyleSheet(QString::fromUtf8(""));

        verticalLayout_5->addWidget(Btn_edit);

        Btn_modify_groups = new QPushButton(frame_5);
        Btn_modify_groups->setObjectName(QString::fromUtf8("Btn_modify_groups"));
        Btn_modify_groups->setMinimumSize(QSize(75, 50));
        Btn_modify_groups->setFont(font);
        Btn_modify_groups->setStyleSheet(QString::fromUtf8(""));

        verticalLayout_5->addWidget(Btn_modify_groups);


        horizontalLayout_3->addWidget(frame_5, 0, Qt::AlignLeft|Qt::AlignTop);

        frame_14 = new QFrame(frame_3);
        frame_14->setObjectName(QString::fromUtf8("frame_14"));
        frame_14->setFrameShape(QFrame::StyledPanel);
        frame_14->setFrameShadow(QFrame::Raised);
        verticalLayout_20 = new QVBoxLayout(frame_14);
        verticalLayout_20->setObjectName(QString::fromUtf8("verticalLayout_20"));
        TextBrowser_group_page = new QTextBrowser(frame_14);
        TextBrowser_group_page->setObjectName(QString::fromUtf8("TextBrowser_group_page"));

        verticalLayout_20->addWidget(TextBrowser_group_page);


        horizontalLayout_3->addWidget(frame_14);


        horizontalLayout_2->addWidget(frame_3);


        verticalLayout_3->addWidget(frame);

        Pages_Widget->addWidget(group_page);
        simplot_page = new QWidget();
        simplot_page->setObjectName(QString::fromUtf8("simplot_page"));
        verticalLayout_7 = new QVBoxLayout(simplot_page);
        verticalLayout_7->setSpacing(0);
        verticalLayout_7->setObjectName(QString::fromUtf8("verticalLayout_7"));
        verticalLayout_7->setContentsMargins(0, 0, 0, 0);
        frame_6 = new QFrame(simplot_page);
        frame_6->setObjectName(QString::fromUtf8("frame_6"));
        frame_6->setFrameShape(QFrame::NoFrame);
        frame_6->setFrameShadow(QFrame::Raised);
        horizontalLayout_6 = new QHBoxLayout(frame_6);
        horizontalLayout_6->setSpacing(0);
        horizontalLayout_6->setObjectName(QString::fromUtf8("horizontalLayout_6"));
        horizontalLayout_6->setContentsMargins(0, 0, 0, 0);
        Disploter_option_bar = new QFrame(frame_6);
        Disploter_option_bar->setObjectName(QString::fromUtf8("Disploter_option_bar"));
        Disploter_option_bar->setMaximumSize(QSize(81, 16777215));
        Disploter_option_bar->setStyleSheet(QString::fromUtf8(""));
        Disploter_option_bar->setFrameShape(QFrame::StyledPanel);
        Disploter_option_bar->setFrameShadow(QFrame::Raised);
        verticalLayout_8 = new QVBoxLayout(Disploter_option_bar);
        verticalLayout_8->setSpacing(0);
        verticalLayout_8->setObjectName(QString::fromUtf8("verticalLayout_8"));
        verticalLayout_8->setContentsMargins(0, 0, 0, 0);
        Btn_start_simplot = new QPushButton(Disploter_option_bar);
        Btn_start_simplot->setObjectName(QString::fromUtf8("Btn_start_simplot"));
        sizePolicy.setHeightForWidth(Btn_start_simplot->sizePolicy().hasHeightForWidth());
        Btn_start_simplot->setSizePolicy(sizePolicy);
        Btn_start_simplot->setMinimumSize(QSize(80, 60));
        Btn_start_simplot->setFont(font);
        Btn_start_simplot->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_8->addWidget(Btn_start_simplot);

        Btn_model_settings = new QPushButton(Disploter_option_bar);
        Btn_model_settings->setObjectName(QString::fromUtf8("Btn_model_settings"));
        sizePolicy.setHeightForWidth(Btn_model_settings->sizePolicy().hasHeightForWidth());
        Btn_model_settings->setSizePolicy(sizePolicy);
        Btn_model_settings->setMinimumSize(QSize(80, 60));
        Btn_model_settings->setFont(font);
        Btn_model_settings->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_8->addWidget(Btn_model_settings);

        Btn_plot_window = new QPushButton(Disploter_option_bar);
        Btn_plot_window->setObjectName(QString::fromUtf8("Btn_plot_window"));
        sizePolicy.setHeightForWidth(Btn_plot_window->sizePolicy().hasHeightForWidth());
        Btn_plot_window->setSizePolicy(sizePolicy);
        Btn_plot_window->setMinimumSize(QSize(80, 60));
        Btn_plot_window->setFont(font);
        Btn_plot_window->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_8->addWidget(Btn_plot_window);

        groupBox_3 = new QGroupBox(Disploter_option_bar);
        groupBox_3->setObjectName(QString::fromUtf8("groupBox_3"));
        groupBox_3->setMaximumSize(QSize(80, 16777215));
        groupBox_3->setStyleSheet(QString::fromUtf8("color: rgb(255, 255, 255);"));
        verticalLayout_22 = new QVBoxLayout(groupBox_3);
        verticalLayout_22->setSpacing(1);
        verticalLayout_22->setObjectName(QString::fromUtf8("verticalLayout_22"));
        verticalLayout_22->setContentsMargins(0, 0, 0, 1);
        comboBox_simplot_refseq = new QComboBox(groupBox_3);
        comboBox_simplot_refseq->setObjectName(QString::fromUtf8("comboBox_simplot_refseq"));
        comboBox_simplot_refseq->setMaximumSize(QSize(80, 16777215));
        comboBox_simplot_refseq->setStyleSheet(QString::fromUtf8("color: rgb(255, 255, 255);"));
        comboBox_simplot_refseq->setSizeAdjustPolicy(QComboBox::AdjustToContents);

        verticalLayout_22->addWidget(comboBox_simplot_refseq);


        verticalLayout_8->addWidget(groupBox_3);

        verticalSpacer_2 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_8->addItem(verticalSpacer_2);


        horizontalLayout_6->addWidget(Disploter_option_bar);

        frame_8 = new QFrame(frame_6);
        frame_8->setObjectName(QString::fromUtf8("frame_8"));
        frame_8->setStyleSheet(QString::fromUtf8(""));
        frame_8->setFrameShape(QFrame::NoFrame);
        frame_8->setFrameShadow(QFrame::Raised);
        verticalLayout_9 = new QVBoxLayout(frame_8);
        verticalLayout_9->setSpacing(0);
        verticalLayout_9->setObjectName(QString::fromUtf8("verticalLayout_9"));
        verticalLayout_9->setContentsMargins(5, 0, 5, 5);
        verticalLayout_10 = new QVBoxLayout();
        verticalLayout_10->setObjectName(QString::fromUtf8("verticalLayout_10"));
        verticalLayout_10->setContentsMargins(-1, 10, -1, 5);

        verticalLayout_9->addLayout(verticalLayout_10);


        horizontalLayout_6->addWidget(frame_8);


        verticalLayout_7->addWidget(frame_6);

        Pages_Widget->addWidget(simplot_page);
        bootscan_page = new QWidget();
        bootscan_page->setObjectName(QString::fromUtf8("bootscan_page"));
        verticalLayout_16 = new QVBoxLayout(bootscan_page);
        verticalLayout_16->setSpacing(0);
        verticalLayout_16->setObjectName(QString::fromUtf8("verticalLayout_16"));
        verticalLayout_16->setContentsMargins(0, 0, 0, 0);
        frame_7 = new QFrame(bootscan_page);
        frame_7->setObjectName(QString::fromUtf8("frame_7"));
        frame_7->setFrameShape(QFrame::StyledPanel);
        frame_7->setFrameShadow(QFrame::Raised);
        horizontalLayout_7 = new QHBoxLayout(frame_7);
        horizontalLayout_7->setSpacing(0);
        horizontalLayout_7->setObjectName(QString::fromUtf8("horizontalLayout_7"));
        horizontalLayout_7->setContentsMargins(0, 0, 0, 0);
        Disploter_option_bar_2 = new QFrame(frame_7);
        Disploter_option_bar_2->setObjectName(QString::fromUtf8("Disploter_option_bar_2"));
        Disploter_option_bar_2->setMaximumSize(QSize(81, 16777215));
        Disploter_option_bar_2->setStyleSheet(QString::fromUtf8(""));
        Disploter_option_bar_2->setFrameShape(QFrame::StyledPanel);
        Disploter_option_bar_2->setFrameShadow(QFrame::Raised);
        verticalLayout_15 = new QVBoxLayout(Disploter_option_bar_2);
        verticalLayout_15->setSpacing(1);
        verticalLayout_15->setObjectName(QString::fromUtf8("verticalLayout_15"));
        verticalLayout_15->setContentsMargins(0, 0, 0, 0);
        Btn_start_bootscan = new QPushButton(Disploter_option_bar_2);
        Btn_start_bootscan->setObjectName(QString::fromUtf8("Btn_start_bootscan"));
        sizePolicy.setHeightForWidth(Btn_start_bootscan->sizePolicy().hasHeightForWidth());
        Btn_start_bootscan->setSizePolicy(sizePolicy);
        Btn_start_bootscan->setMinimumSize(QSize(80, 60));
        Btn_start_bootscan->setFont(font);
        Btn_start_bootscan->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_15->addWidget(Btn_start_bootscan);

        Btn_bootscan_settings = new QPushButton(Disploter_option_bar_2);
        Btn_bootscan_settings->setObjectName(QString::fromUtf8("Btn_bootscan_settings"));
        sizePolicy.setHeightForWidth(Btn_bootscan_settings->sizePolicy().hasHeightForWidth());
        Btn_bootscan_settings->setSizePolicy(sizePolicy);
        Btn_bootscan_settings->setMinimumSize(QSize(80, 60));
        Btn_bootscan_settings->setFont(font);
        Btn_bootscan_settings->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_15->addWidget(Btn_bootscan_settings);

        Btn_plot_window_bootscan = new QPushButton(Disploter_option_bar_2);
        Btn_plot_window_bootscan->setObjectName(QString::fromUtf8("Btn_plot_window_bootscan"));
        sizePolicy.setHeightForWidth(Btn_plot_window_bootscan->sizePolicy().hasHeightForWidth());
        Btn_plot_window_bootscan->setSizePolicy(sizePolicy);
        Btn_plot_window_bootscan->setMinimumSize(QSize(80, 60));
        Btn_plot_window_bootscan->setFont(font);
        Btn_plot_window_bootscan->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_15->addWidget(Btn_plot_window_bootscan);

        groupBox = new QGroupBox(Disploter_option_bar_2);
        groupBox->setObjectName(QString::fromUtf8("groupBox"));
        groupBox->setMaximumSize(QSize(80, 16777215));
        groupBox->setStyleSheet(QString::fromUtf8("color: rgb(255, 255, 255);"));
        verticalLayout_11 = new QVBoxLayout(groupBox);
        verticalLayout_11->setSpacing(1);
        verticalLayout_11->setObjectName(QString::fromUtf8("verticalLayout_11"));
        verticalLayout_11->setContentsMargins(0, 0, 0, 1);
        comboBox_Bootscan_refseq = new QComboBox(groupBox);
        comboBox_Bootscan_refseq->setObjectName(QString::fromUtf8("comboBox_Bootscan_refseq"));
        comboBox_Bootscan_refseq->setMaximumSize(QSize(80, 16777215));
        comboBox_Bootscan_refseq->setStyleSheet(QString::fromUtf8("color: rgb(255, 255, 255);"));
        comboBox_Bootscan_refseq->setSizeAdjustPolicy(QComboBox::AdjustToContents);

        verticalLayout_11->addWidget(comboBox_Bootscan_refseq);


        verticalLayout_15->addWidget(groupBox);

        verticalSpacer_3 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_15->addItem(verticalSpacer_3);


        horizontalLayout_7->addWidget(Disploter_option_bar_2);

        frame_9 = new QFrame(frame_7);
        frame_9->setObjectName(QString::fromUtf8("frame_9"));
        frame_9->setFrameShape(QFrame::StyledPanel);
        frame_9->setFrameShadow(QFrame::Raised);
        verticalLayout_13 = new QVBoxLayout(frame_9);
        verticalLayout_13->setSpacing(5);
        verticalLayout_13->setObjectName(QString::fromUtf8("verticalLayout_13"));
        verticalLayout_13->setContentsMargins(5, 5, 5, 5);
        verticalLayout_14 = new QVBoxLayout();
        verticalLayout_14->setObjectName(QString::fromUtf8("verticalLayout_14"));

        verticalLayout_13->addLayout(verticalLayout_14);


        horizontalLayout_7->addWidget(frame_9);


        verticalLayout_16->addWidget(frame_7);

        Pages_Widget->addWidget(bootscan_page);
        findSites_page = new QWidget();
        findSites_page->setObjectName(QString::fromUtf8("findSites_page"));
        verticalLayout_12 = new QVBoxLayout(findSites_page);
        verticalLayout_12->setSpacing(0);
        verticalLayout_12->setObjectName(QString::fromUtf8("verticalLayout_12"));
        verticalLayout_12->setContentsMargins(0, 0, 0, 0);
        frame_10 = new QFrame(findSites_page);
        frame_10->setObjectName(QString::fromUtf8("frame_10"));
        frame_10->setFrameShape(QFrame::StyledPanel);
        frame_10->setFrameShadow(QFrame::Raised);
        verticalLayout_17 = new QVBoxLayout(frame_10);
        verticalLayout_17->setSpacing(0);
        verticalLayout_17->setObjectName(QString::fromUtf8("verticalLayout_17"));
        verticalLayout_17->setContentsMargins(0, 0, 0, 0);
        frame_11 = new QFrame(frame_10);
        frame_11->setObjectName(QString::fromUtf8("frame_11"));
        frame_11->setFrameShape(QFrame::StyledPanel);
        frame_11->setFrameShadow(QFrame::Raised);
        horizontalLayout_8 = new QHBoxLayout(frame_11);
        horizontalLayout_8->setSpacing(0);
        horizontalLayout_8->setObjectName(QString::fromUtf8("horizontalLayout_8"));
        horizontalLayout_8->setContentsMargins(0, 0, 0, 0);
        groupBox_2 = new QGroupBox(frame_11);
        groupBox_2->setObjectName(QString::fromUtf8("groupBox_2"));
        gridLayout = new QGridLayout(groupBox_2);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        comboBox_ref1 = new QComboBox(groupBox_2);
        comboBox_ref1->setObjectName(QString::fromUtf8("comboBox_ref1"));

        gridLayout->addWidget(comboBox_ref1, 1, 1, 1, 1);

        comboBox_query = new QComboBox(groupBox_2);
        comboBox_query->setObjectName(QString::fromUtf8("comboBox_query"));

        gridLayout->addWidget(comboBox_query, 0, 1, 1, 1);

        comboBox_ref2 = new QComboBox(groupBox_2);
        comboBox_ref2->setObjectName(QString::fromUtf8("comboBox_ref2"));

        gridLayout->addWidget(comboBox_ref2, 2, 1, 1, 1);

        comboBox_outgroup = new QComboBox(groupBox_2);
        comboBox_outgroup->setObjectName(QString::fromUtf8("comboBox_outgroup"));

        gridLayout->addWidget(comboBox_outgroup, 3, 1, 1, 1);

        label_2 = new QLabel(groupBox_2);
        label_2->setObjectName(QString::fromUtf8("label_2"));
        label_2->setFont(font);

        gridLayout->addWidget(label_2, 0, 0, 1, 1);

        label_3 = new QLabel(groupBox_2);
        label_3->setObjectName(QString::fromUtf8("label_3"));
        label_3->setFont(font);

        gridLayout->addWidget(label_3, 1, 0, 1, 1);

        label_4 = new QLabel(groupBox_2);
        label_4->setObjectName(QString::fromUtf8("label_4"));
        label_4->setFont(font);

        gridLayout->addWidget(label_4, 2, 0, 1, 1);

        label_5 = new QLabel(groupBox_2);
        label_5->setObjectName(QString::fromUtf8("label_5"));
        label_5->setFont(font);

        gridLayout->addWidget(label_5, 3, 0, 1, 1);


        horizontalLayout_8->addWidget(groupBox_2);

        frame_13 = new QFrame(frame_11);
        frame_13->setObjectName(QString::fromUtf8("frame_13"));
        frame_13->setFrameShape(QFrame::StyledPanel);
        frame_13->setFrameShadow(QFrame::Raised);
        verticalLayout_19 = new QVBoxLayout(frame_13);
        verticalLayout_19->setObjectName(QString::fromUtf8("verticalLayout_19"));
        Btn_begin_findSites = new QPushButton(frame_13);
        Btn_begin_findSites->setObjectName(QString::fromUtf8("Btn_begin_findSites"));
        Btn_begin_findSites->setFont(font);

        verticalLayout_19->addWidget(Btn_begin_findSites);

        Btn_save_findSite = new QPushButton(frame_13);
        Btn_save_findSite->setObjectName(QString::fromUtf8("Btn_save_findSite"));
        Btn_save_findSite->setFont(font);

        verticalLayout_19->addWidget(Btn_save_findSite);

        Btn_reset_findSite = new QPushButton(frame_13);
        Btn_reset_findSite->setObjectName(QString::fromUtf8("Btn_reset_findSite"));
        Btn_reset_findSite->setFont(font);

        verticalLayout_19->addWidget(Btn_reset_findSite);


        horizontalLayout_8->addWidget(frame_13);


        verticalLayout_17->addWidget(frame_11);

        frame_12 = new QFrame(frame_10);
        frame_12->setObjectName(QString::fromUtf8("frame_12"));
        frame_12->setFrameShape(QFrame::Box);
        frame_12->setFrameShadow(QFrame::Raised);
        frame_12->setLineWidth(2);
        verticalLayout_18 = new QVBoxLayout(frame_12);
        verticalLayout_18->setSpacing(5);
        verticalLayout_18->setObjectName(QString::fromUtf8("verticalLayout_18"));
        verticalLayout_18->setContentsMargins(5, 5, 5, 5);
        findSite_output_browser = new QPlainTextEdit(frame_12);
        findSite_output_browser->setObjectName(QString::fromUtf8("findSite_output_browser"));
        findSite_output_browser->setStyleSheet(QString::fromUtf8("\n"
"QPlainTextEdit {\n"
"    background-color: white;\n"
"	color: rgb(0, 0, 0);\n"
"	\n"
"}\n"
"\n"
"QScrollBar:vertical {\n"
"  width: 15px;\n"
"  background: #f1f1f1;\n"
"}\n"
"\n"
"QScrollBar::handle:vertical {\n"
"  background: #888;\n"
"}\n"
"\n"
"QScrollBar::add-line:vertical {\n"
"  border: 2px solid gray;\n"
"  background: #f1f1f1;\n"
"}\n"
"\n"
"QScrollBar::sub-line:horizontal {\n"
"  border: 2px solid gray;\n"
"  background: #f1f1f1;\n"
"}\n"
"\n"
"QScrollBar::handle:hover:vertical {\n"
"  background: #555;\n"
"}"));
        findSite_output_browser->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOn);
        findSite_output_browser->setReadOnly(true);
        findSite_output_browser->setTextInteractionFlags(Qt::TextSelectableByMouse);
        findSite_output_browser->setBackgroundVisible(true);

        verticalLayout_18->addWidget(findSite_output_browser);


        verticalLayout_17->addWidget(frame_12);


        verticalLayout_12->addWidget(frame_10);

        Pages_Widget->addWidget(findSites_page);
        network_page = new QWidget();
        network_page->setObjectName(QString::fromUtf8("network_page"));
        verticalLayout_24 = new QVBoxLayout(network_page);
        verticalLayout_24->setSpacing(0);
        verticalLayout_24->setObjectName(QString::fromUtf8("verticalLayout_24"));
        verticalLayout_24->setContentsMargins(0, 0, 0, 0);
        frame_15 = new QFrame(network_page);
        frame_15->setObjectName(QString::fromUtf8("frame_15"));
        frame_15->setFrameShape(QFrame::NoFrame);
        frame_15->setFrameShadow(QFrame::Raised);
        horizontalLayout_9 = new QHBoxLayout(frame_15);
        horizontalLayout_9->setSpacing(0);
        horizontalLayout_9->setObjectName(QString::fromUtf8("horizontalLayout_9"));
        horizontalLayout_9->setContentsMargins(0, 0, 0, 0);
        Disploter_option_bar_3 = new QFrame(frame_15);
        Disploter_option_bar_3->setObjectName(QString::fromUtf8("Disploter_option_bar_3"));
        Disploter_option_bar_3->setMaximumSize(QSize(81, 16777215));
        Disploter_option_bar_3->setStyleSheet(QString::fromUtf8(""));
        Disploter_option_bar_3->setFrameShape(QFrame::StyledPanel);
        Disploter_option_bar_3->setFrameShadow(QFrame::Raised);
        verticalLayout_21 = new QVBoxLayout(Disploter_option_bar_3);
        verticalLayout_21->setSpacing(1);
        verticalLayout_21->setObjectName(QString::fromUtf8("verticalLayout_21"));
        verticalLayout_21->setContentsMargins(0, 0, 0, 0);
        Btn_start_sp_network = new QPushButton(Disploter_option_bar_3);
        Btn_start_sp_network->setObjectName(QString::fromUtf8("Btn_start_sp_network"));
        sizePolicy.setHeightForWidth(Btn_start_sp_network->sizePolicy().hasHeightForWidth());
        Btn_start_sp_network->setSizePolicy(sizePolicy);
        Btn_start_sp_network->setMinimumSize(QSize(80, 60));
        Btn_start_sp_network->setFont(font);
        Btn_start_sp_network->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_21->addWidget(Btn_start_sp_network);

        Btn_network_settings = new QPushButton(Disploter_option_bar_3);
        Btn_network_settings->setObjectName(QString::fromUtf8("Btn_network_settings"));
        sizePolicy.setHeightForWidth(Btn_network_settings->sizePolicy().hasHeightForWidth());
        Btn_network_settings->setSizePolicy(sizePolicy);
        Btn_network_settings->setMinimumSize(QSize(80, 60));
        Btn_network_settings->setFont(font);
        Btn_network_settings->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_21->addWidget(Btn_network_settings);

        Btn_save_html = new QPushButton(Disploter_option_bar_3);
        Btn_save_html->setObjectName(QString::fromUtf8("Btn_save_html"));
        sizePolicy.setHeightForWidth(Btn_save_html->sizePolicy().hasHeightForWidth());
        Btn_save_html->setSizePolicy(sizePolicy);
        Btn_save_html->setMinimumSize(QSize(80, 60));
        Btn_save_html->setFont(font);
        Btn_save_html->setStyleSheet(QString::fromUtf8("background-color: rgb(82, 109, 124);\n"
"color: rgb(255, 255, 255);"));

        verticalLayout_21->addWidget(Btn_save_html);

        verticalSpacer_4 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_21->addItem(verticalSpacer_4);


        horizontalLayout_9->addWidget(Disploter_option_bar_3);

        frame_16 = new QFrame(frame_15);
        frame_16->setObjectName(QString::fromUtf8("frame_16"));
        frame_16->setStyleSheet(QString::fromUtf8(""));
        frame_16->setFrameShape(QFrame::NoFrame);
        frame_16->setFrameShadow(QFrame::Raised);
        horizontalLayout_10 = new QHBoxLayout(frame_16);
        horizontalLayout_10->setObjectName(QString::fromUtf8("horizontalLayout_10"));
        Vlayout_network = new QVBoxLayout();
        Vlayout_network->setObjectName(QString::fromUtf8("Vlayout_network"));
        Vlayout_network->setSizeConstraint(QLayout::SetMinimumSize);
        Vlayout_network->setContentsMargins(0, 10, -1, 5);

        horizontalLayout_10->addLayout(Vlayout_network);


        horizontalLayout_9->addWidget(frame_16);


        verticalLayout_24->addWidget(frame_15);

        Pages_Widget->addWidget(network_page);

        verticalLayout_2->addWidget(Pages_Widget);


        horizontalLayout->addWidget(frame_pages);


        verticalLayout->addWidget(content);

        MainWindow->setCentralWidget(centralwidget);

        retranslateUi(MainWindow);

        Btn_group_page->setDefault(false);
        Pages_Widget->setCurrentIndex(0);


        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QCoreApplication::translate("MainWindow", "Simplot++", nullptr));
        Btn_group_page->setText(QCoreApplication::translate("MainWindow", "Group Selection", nullptr));
        Btn_simplot_page->setText(QCoreApplication::translate("MainWindow", "Simplot", nullptr));
        Btn_bootstrap_page->setText(QCoreApplication::translate("MainWindow", "BootScan", nullptr));
        Btn_findSites->setText(QCoreApplication::translate("MainWindow", "Find Sites", nullptr));
        Btn_simplot_network->setText(QCoreApplication::translate("MainWindow", "Network", nullptr));
        Btn_File_Browser->setText(QString());
        Btn_reopen->setText(QCoreApplication::translate("MainWindow", "ReOpen", nullptr));
        Btn_save_nexus->setText(QCoreApplication::translate("MainWindow", "Save Groups", nullptr));
        label->setText(QCoreApplication::translate("MainWindow", "<html><head/><body><p>List of current groups (at least 2 groups needed)</p></body></html>", nullptr));
        Btn_add->setText(QCoreApplication::translate("MainWindow", "New group", nullptr));
        Btn_del->setText(QCoreApplication::translate("MainWindow", "Delete group", nullptr));
        Btn_edit->setText(QCoreApplication::translate("MainWindow", "Edit name", nullptr));
        Btn_modify_groups->setText(QCoreApplication::translate("MainWindow", "Select group \n"
"Content", nullptr));
        TextBrowser_group_page->setHtml(QCoreApplication::translate("MainWindow", "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0//EN\" \"http://www.w3.org/TR/REC-html40/strict.dtd\">\n"
"<html><head><meta name=\"qrichtext\" content=\"1\" /><style type=\"text/css\">\n"
"p, li { white-space: pre-wrap; }\n"
"</style></head><body style=\" font-family:'MS Shell Dlg 2'; font-size:8.25pt; font-weight:400; font-style:normal;\">\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" color:#ffffff;\">SimPlot++ is an updated and improved version of the original SimPlot program (link here)</span></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; color:#ffffff;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" font-weight:600; text-decoration: underline; color:#ffffff;\">Steps</span></p>\n"
"<p style=\"-qt-paragraph-type"
                        ":empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; font-weight:600; text-decoration: underline; color:#ffffff;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" color:#ffffff;\">1. To begin, select your input file through the &quot;Browse Files&quot; button </span></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; color:#ffffff;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" color:#ffffff;\">2. Use the &quot;New Group&quot; button to split your sequences into groups by either double-clicking the specific group widget or using the &quot;Select Group Content&quot; button</span></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin"
                        "-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; color:#ffffff;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" color:#ffffff;\">3. (optional) Modify the group colors by double clicking the colored square</span></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; color:#ffffff;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" color:#ffffff;\">4. Choose the analysis type that fits your need on the top menu bar</span></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; color:#ffffff;\"><br /></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; marg"
                        "in-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; color:#ffffff;\"><br /></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; color:#ffffff;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" color:#ffffff;\">A more in depth guide is available here (add hyperlink)</span></p></body></html>", nullptr));
        Btn_start_simplot->setText(QCoreApplication::translate("MainWindow", "Launch\n"
" Simplot", nullptr));
        Btn_model_settings->setText(QCoreApplication::translate("MainWindow", "Model\n"
"Settings", nullptr));
        Btn_plot_window->setText(QCoreApplication::translate("MainWindow", "Show Plot\n"
"In Other\n"
"Window", nullptr));
        groupBox_3->setTitle(QCoreApplication::translate("MainWindow", "Reference", nullptr));
        Btn_start_bootscan->setText(QCoreApplication::translate("MainWindow", "Launch\n"
"Bootscan", nullptr));
        Btn_bootscan_settings->setText(QCoreApplication::translate("MainWindow", "Model\n"
"Settings", nullptr));
        Btn_plot_window_bootscan->setText(QCoreApplication::translate("MainWindow", "Show Plot\n"
"In Other\n"
"Window", nullptr));
        groupBox->setTitle(QCoreApplication::translate("MainWindow", "Reference", nullptr));
        groupBox_2->setTitle(QCoreApplication::translate("MainWindow", "GroupBox", nullptr));
        label_2->setText(QCoreApplication::translate("MainWindow", "Query", nullptr));
        label_3->setText(QCoreApplication::translate("MainWindow", "Ref1", nullptr));
        label_4->setText(QCoreApplication::translate("MainWindow", "Ref2", nullptr));
        label_5->setText(QCoreApplication::translate("MainWindow", "Outgroup", nullptr));
        Btn_begin_findSites->setText(QCoreApplication::translate("MainWindow", "Start", nullptr));
        Btn_save_findSite->setText(QCoreApplication::translate("MainWindow", "Save results", nullptr));
        Btn_reset_findSite->setText(QCoreApplication::translate("MainWindow", "Reset", nullptr));
        findSite_output_browser->setPlainText(QString());
        findSite_output_browser->setPlaceholderText(QCoreApplication::translate("MainWindow", "Select 4 distinct sequences and press START to begin analysis", nullptr));
        Btn_start_sp_network->setText(QCoreApplication::translate("MainWindow", "Launch\n"
" Network", nullptr));
        Btn_network_settings->setText(QCoreApplication::translate("MainWindow", "Analysis\n"
"Settings", nullptr));
        Btn_save_html->setText(QCoreApplication::translate("MainWindow", "Save HTML\n"
"File", nullptr));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
