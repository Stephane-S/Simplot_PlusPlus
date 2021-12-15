#include "model_dialog.h"
#include "ui_model_dialog.h"

model_dialog::model_dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::model_dialog)
{
    ui->setupUi(this);
}

model_dialog::~model_dialog()
{
    delete ui;
}
