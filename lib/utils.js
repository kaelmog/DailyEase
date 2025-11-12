export const generateSalesReportMessage = (form) => {
  const payments = form.payments;
  const totalSales =
    payments.cash.amount +
    payments.qris.amount +
    payments.grabfood.amount +
    payments.gofood.amount +
    payments.debit.amount +
    payments.credit_card.amount +
    payments.transfer.amount +
    payments.voucher.amount +
    payments.transfer_outstanding.amount;

  const totalTransactions =
    payments.qris.transactions +
    payments.grabfood.transactions +
    payments.gofood.transactions +
    payments.debit.transactions +
    payments.credit_card.transactions;

  const sales = form.summary_sales;
  return `Sales Report closing Outlet ${form.outlet_name} ${form.date}

1. Cash         : Rp. ${payments.cash.amount}
2. Qris.        : Rp. ${payments.qris.amount} / ${
    payments.qris.transactions ? payments.qris.transactions : ""
  } transaksi
3. grabfood.    : Rp. ${payments.grabfood.amount} / ${
    payments.grabfood.transactions ? payments.grabfood.transactions : ""
  } transaksi
4. Gofood.      : Rp. ${payments.gofood.amount} / ${
    payments.gofood.transactions ? payments.gofood.transactions : ""
  }  transaksi 
5. Debit.       : Rp. ${payments.debit.amount} / ${
    payments.debit.transactions ? payments.debit.transactions : ""
  } transaksi 
6. Credit card  : Rp. ${payments.credit_card.amount} / ${
    payments.credit_card.transactions ? payments.credit_card.transactions : ""
  } transaksi
7. ⁠transfer     : Rp. ${payments.transfer.amount}   
8. ⁠Voucher      : Rp. ${payments.voucher.amount}
9. Transfer oustanding : Rp. ${payments.transfer_outstanding.amount}

TOTAL : Rp. ${totalSales} / ${totalTransactions} transaksi 


Sales report produk The Wheat ${form.date}

* pastry        : ${sales.pastry}
* Bread         : ${sales.bread}
* Daily         : ${sales.daily}
* Drink.        : ${sales.drink}
* ⁠Susu Kurma    : ${sales.susu_kurma}
- mineral water : ${sales.mineral_water}
- fresh juice   : ${sales.fresh_juice}
- susu uht      : ${sales.susu_uht}
- coffee spoke  : ${sales.coffee_spoke}
- PB1           : ${sales.pb1}

Terimakasih`;
};

export const generateLeftoversMessage = (form, leftoversByCategory) => {
  if (!leftoversByCategory || Object.keys(leftoversByCategory).length === 0) {
    return "ERROR: Leftovers data not available for report generation.";
  }

  let msg = `SISA PRODUK THE WHEAT RS PURI CINERE, ${form.date}\n\n`;
  Object.keys(leftoversByCategory).forEach((catName) => {
    msg += `*${catName}*\n`;
    leftoversByCategory[catName].forEach((item) => {
      msg += `${item.name} : ${item.quantity_left}\n`;
    });
    msg += "\n";
  });
  return msg;
};

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

export const openWhatsApp = (text) => {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};
