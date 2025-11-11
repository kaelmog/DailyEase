import { formatIdNumber } from "./format";

export const generateSalesReportMessage = (date, salesData, productSummary) => {
  const totalSales =
    salesData.cash.amount +
    salesData.qris.amount +
    salesData.grabfood.amount +
    salesData.gofood.amount +
    salesData.debit.amount +
    salesData.credit_card.amount +
    salesData.transfer.amount +
    salesData.voucher.amount +
    salesData.transfer_outstanding.amount;

  const totalTransactions =
    salesData.cash.transactions +
    salesData.qris.transactions +
    salesData.grabfood.transactions +
    salesData.gofood.transactions +
    salesData.debit.transactions +
    salesData.credit_card.transactions +
    salesData.transfer.transactions +
    salesData.voucher.transactions +
    salesData.transfer_outstanding.transactions;

  const sales = productSummary;
  return `Sales Report closing Outlet THE WHEAT RS PURI CINERE ${date}

1. Cash         Rp${formatIdNumber(salesData.cash.amount)} ${
    salesData.cash.transactions > 0
      ? `/ ${salesData.cash.transactions} transaksi`
      : ""
  }
2. Qris.        Rp${formatIdNumber(salesData.qris.amount)} ${
    salesData.qris.transactions > 0
      ? `/ ${salesData.qris.transactions} transaksi`
      : ""
  }
3. grabfood.    Rp${formatIdNumber(salesData.grabfood.amount)} ${
    salesData.grabfood.transactions > 0
      ? `/ ${salesData.grabfood.transactions} transaksi`
      : ""
  }
4. Gofood.      Rp${formatIdNumber(salesData.gofood.amount)} ${
    salesData.gofood.transactions > 0
      ? `/ ${salesData.gofood.transactions} transaksi`
      : ""
  }
5. Debit.       Rp${formatIdNumber(salesData.debit.amount)} ${
    salesData.debit.transactions > 0
      ? `/ ${salesData.debit.transactions} transaksi`
      : ""
  }
6. Credit card  Rp${formatIdNumber(salesData.credit_card.amount)} ${
    salesData.credit_card.transactions > 0
      ? `/ ${salesData.credit_card.transactions} transaksi`
      : ""
  }
7. ⁠transfer     Rp${formatIdNumber(salesData.transfer.amount)} ${
    salesData.transfer.transactions > 0
      ? `/ ${salesData.transfer.transactions} transaksi`
      : ""
  }   
8. ⁠Voucher      Rp${formatIdNumber(salesData.voucher.amount)} ${
    salesData.voucher.transactions > 0
      ? `/ ${salesData.voucher.transactions} transaksi`
      : ""
  }
9. Transfer oustanding Rp${formatIdNumber(
    salesData.transfer_outstanding.amount
  )} ${
    salesData.transfer_outstanding.transactions > 0
      ? `/ ${salesData.transfer_outstanding.transactions} transaksi`
      : ""
  }

TOTAL : Rp${formatIdNumber(totalSales)} / ${totalTransactions} transaksi 


Sales report produk The Wheat ${date}

* pastry        : Rp${formatIdNumber(sales.pastry)}
* Bread         : Rp${formatIdNumber(sales.bread)}
* Daily         : Rp${formatIdNumber(sales.daily)}
* Drink.        : Rp${formatIdNumber(sales.drink)}
* ⁠Susu Kurma    : Rp${formatIdNumber(sales.susu_kurma)}
- mineral water : Rp${formatIdNumber(sales.mineral_water)}
- fresh juice   : Rp${formatIdNumber(sales.fresh_juice)}
- susu uht      : Rp${formatIdNumber(sales.susu_uht)}
- coffee spoke  : Rp${formatIdNumber(sales.coffee_spoke)}
- PB1           : Rp${formatIdNumber(sales.pb1)}

Terimakasih`;
};

export const generateLeftoversReportMessage = (
  date,
  product_categories,
  catName,
  leftoversByCategory
) => {
  if (!date) return "ERROR: No item data provided.";
  if (!Array.isArray(product_categories) || product_categories.length === 0)
    return "ERROR: No category data available.";

  let msg = `SISA PRODUK THE WHEAT RS PURI CINERE, ${date}\n\n`;

  catName.map((name) => {
    msg += `*${name}*\n`;
    leftoversByCategory[name].forEach((item) => {
      msg += `${item.name} : ${item.quantity_left}\n`;
    });
    msg += "\n";
  });

  return msg;
};
