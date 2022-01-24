#include "seq_window.h"
#include "ui_seq_window.h"

Seq_window::Seq_window(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Seq_window)
{
    ui->setupUi(this);
}

Seq_window::~Seq_window()
{
    delete ui;
}
