#ifndef SIMPLOT_SETTINGS_FORM_H
#define SIMPLOT_SETTINGS_FORM_H

#include <QDialog>

namespace Ui {
class SimPlot_settings_form;
}

class SimPlot_settings_form : public QDialog
{
    Q_OBJECT

public:
    explicit SimPlot_settings_form(QWidget *parent = nullptr);
    ~SimPlot_settings_form();

private:
    Ui::SimPlot_settings_form *ui;
};

#endif // SIMPLOT_SETTINGS_FORM_H
