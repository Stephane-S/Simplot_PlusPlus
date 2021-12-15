QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++11

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    main.cpp \
    mainwindow.cpp \
    model_dialog.cpp \
    seq_window.cpp \
    simplot_settings_form.cpp

HEADERS += \
    mainwindow.h \
    model_dialog.h \
    seq_window.h \
    simplot_settings_form.h

FORMS += \
    app_settings.ui \
    bootscan_dialog.ui \
    file_info_dialog.ui \
    group_list_widget.ui \
    mainwindow.ui \
    model_dialog.ui \
    seq_window.ui \
    simplot_settings_form.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    icons/Icons.qrc
