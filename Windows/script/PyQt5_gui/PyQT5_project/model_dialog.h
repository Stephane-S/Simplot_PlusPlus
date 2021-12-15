#ifndef MODEL_DIALOG_H
#define MODEL_DIALOG_H

#include <QDialog>

namespace Ui {
class model_dialog;
}

class model_dialog : public QDialog
{
    Q_OBJECT

public:
    explicit model_dialog(QWidget *parent = nullptr);
    ~model_dialog();

private:
    Ui::model_dialog *ui;
};

#endif // MODEL_DIALOG_H
