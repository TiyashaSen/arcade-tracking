import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Transaction {
  description: string;
  amount: number;
  cost?: number;
  date: Date;
  message: string;
  isSpend: boolean;
  status: string;
}

@Component({
  selector: 'app-token-system',
  templateUrl: './token-system.component.html',
  styleUrls: ['./token-system.component.css']
})
export class TokenSystemComponent {
  purchaseForm: FormGroup;
  spendForm: FormGroup;
  purchaseAmount: number = 0;
  purchaseDescription: string = '';
  spendAmount: number = 0;
  spendDescription: string = '';
  tokenBalance: number = 0;
  random: number;
  transactionHistory: { description: string, amount: number, date: Date, isSpend: boolean, status: string }[] = [];

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.spendDescription = "";
    this.transactionHistory = [];
    this.tokenBalance = 0;
  }

  ngOnInit(): void {
    this.random = Math.random();
    this.purchaseForm = this.formBuilder.group({
      amount: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.spendForm = this.formBuilder.group({
      amount: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  purchaseTokens() {
    const data = { amount: this.purchaseAmount, description: this.purchaseDescription, isSpend: false};
    this.http.post<{ message: string }>('http://localhost:3000/purchase', data)
      .subscribe(response => {
        this.refreshTokenBalance();
        this.http.get<{ transactions: Transaction[] }>('http://localhost:3000/transactionsHistory')
          .subscribe(response => {
            this.transactionHistory = response.transactions;
            console.log(this.transactionHistory);
          }, error => {
            console.log(error);
          });
        alert(response.message);
      }, error => {
        console.log(error);
      });
  }

  spendTokens() {
    const data = { amount: this.spendAmount, description: this.spendDescription, isSpend: true};
    this.http.post<{ message: string }>('http://localhost:3000/spend', data)
      .subscribe(response => {
        this.refreshTokenBalance();
        this.http.get<{ transactions: Transaction[] }>('http://localhost:3000/transactionsHistory')
          .subscribe(response => {
            this.transactionHistory = response.transactions;
            console.log(this.transactionHistory);
          }, error => {
            alert(response.message);
            console.log(error);
          });
        alert(response.message);
      }, error => {
        if (error.status === 400) {
          alert(error.error.message);
        }
        console.log(error);
      });
  }


  refreshTokenBalance() {
    //this.clearTokenData();
    this.http.get<{ tokens: number }>('http://localhost:3000/tokens')
      .subscribe(response => {
        this.tokenBalance = response.tokens;
      }, error => {
        console.log(error);
      });
  }


}
