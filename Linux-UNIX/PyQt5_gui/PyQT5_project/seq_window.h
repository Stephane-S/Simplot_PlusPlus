#ifndef SEQ_WINDOW_H
#define SEQ_WINDOW_H

#include <QDialog>

namespace Ui {
class Seq_window;
}

class Seq_window : public QDialog
{
    Q_OBJECT

public:
    explicit Seq_window(QWidget *parent = nullptr);
    ~Seq_window();

private slots:
    void on_pushButton_3_clicked();

private:
    Ui::Seq_window *ui;
};

#endif // SEQ_WINDOW_H
