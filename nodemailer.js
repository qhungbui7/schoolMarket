var nodemailer = require('nodemailer');

module.exports.send = function(customer,item){
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: process.env.SERVICE,
        auth: {
            user: process.env.IDEMAIL,
            pass: process.env.PASSWORDMAIL
        }
    });

    var mailOptions = {
        from: process.env.IDEMAIL,
        to: customer.email,
        subject: 'Có người vừa đặt hàng của bạn',
        text: `
            Người dùng : ${customer.id} 
            Tên người dùng : ${customer.name} 
            Địa chỉ email : ${customer.email}
            Số điện thoại : ${customer.phone}
            Địa chỉ facebook : ${customer.fb}
            Tên hàng : ${item.nameItem} 
            Số lượng : ${customer.amount}
            Ngày giao hàng mong muốn : ${customer.dateReceive}
            Ngày giao hàng đã ghi trên đơn hàng : ${item.dateItem}
        `
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}