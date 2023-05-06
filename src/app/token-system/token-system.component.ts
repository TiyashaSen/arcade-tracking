import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Transaction {
  description: string;
  amount: number;
  cost?: number;
  date: Date;
  message: string;
}

@Component({
  selector: 'app-token-system',
  templateUrl: './token-system.component.html',
  styleUrls: ['./token-system.component.css']
})
export class TokenSystemComponent {
  purchaseAmount = 0;
  purchaseDescription = "";
  spendAmount = 0;
  tokenBalance = 0;
  spendDescription: string = ""; // add initialization here
  transactionHistory: Transaction[] = [];

  constructor(private http: HttpClient) {
    this.spendDescription = "";
  }

  ngOnInit() {
    this.refreshTokenBalance();
    this.refreshTransactionHistory();
  }

  purchaseTokens() {
    const data = { amount: this.purchaseAmount, description: this.purchaseDescription };
    this.http.post<{ message: string }>('http://localhost:3000/purchase', data)
      .subscribe(response => {
        this.refreshTokenBalance();
        this.refreshTransactionHistory();
        alert(response.message);
      }, error => {
        console.log(error);
      });
  }

  spendTokens() {
    const data = { amount: this.spendAmount, description: this.spendDescription };
    this.http.post<{ message: string }>('http://localhost:3000/spend', data)
      .subscribe(response => {
        this.refreshTokenBalance();
        this.refreshTransactionHistory();
        alert(response.message);
      }, error => {
        console.log(error);
      });
  }

  refreshTokenBalance() {
    this.http.get<{ tokens: number }>('http://localhost:3000/tokens')
      .subscribe(response => {
        this.tokenBalance = response.tokens;
      }, error => {
        console.log(error);
      });
  }

  refreshTransactionHistory() {
    this.http.get<{ transactions: Transaction[] }>('http://localhost:3000/transactionsHistory')
      .subscribe(response => {
        this.transactionHistory = response.transactions;
        console.log(this.transactionHistory);
      }, error => {
        console.log(error);
      });
  }

}
