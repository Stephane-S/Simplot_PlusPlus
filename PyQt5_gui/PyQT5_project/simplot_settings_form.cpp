#include "simplot_settings_form.h"
#include "ui_simplot_settings_form.h"

SimPlot_settings_form::SimPlot_settings_form(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::SimPlot_settings_form)
{
    ui->setupUi(this);
}

SimPlot_settings_form::~SimPlot_settings_form()
{
    delete ui;
}
