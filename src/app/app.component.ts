import {Component, OnInit, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient) {
  }


  ngOnInit(): void {
    this.getLocation();
  }

  states = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telengana', 'Tripura',
    'Uttarakhand', 'Uttar Pradesh', 'West Bengal'];

  state: State[];
  title = 'Stat-Covid';
  showTable  = false;
  showStateTable = false;
  searchText:string = null;


  currentState : State = {
    confirmed: 0,
    cured: 0,
    death: 0,
    name: '',
    total: 0,
    _id: ''
  };

  currentStatePercentage : State = {
    confirmed: 0,
    cured: 0,
    death: 0,
    name: '',
    total: 0,
    _id: ''
  };


  singleState : State = {
  confirmed: 0,
  cured: 0,
  death: 0,
  name: '',
  total: 0,
  _id: ''
  };


  getDetails() {
    this.http.get<any>('http://covid19-india-adhikansh.herokuapp.com/states').subscribe(
      res => {
        this.state = res.state;
        this.showTable = true;
      }
    )
  }


  stateName: any = null;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  getDetailsByState() {
    console.log(this.stateName);
    if(this.stateName != null){
      this.stateName = encodeURIComponent(this.stateName.trim());
      this.http.get<any>('http://covid19-india-adhikansh.herokuapp.com/state/'+this.stateName).subscribe(
        res => {
          this.state = res.data;
          this.calculateSingleStateProgressBar(res.data[0]);
          this.showStateTable = true;
        }
      )
    }
  }

  calculateSingleStateProgressBar(state) {
    this.singleState.total = 100;
    this.singleState.confirmed = (state.confirmed/state.total)*100;
    this.singleState.cured = (state.cured/state.total)*100;
    this.singleState.death = (state.death/state.total)*100;
  }

  toggleShowTable() {
    this.showTable = false;
    this.showStateTable = false;
    this.stateName = null;
  }

  getLocation() {
    let ip = '';
    this.http.get<any>("http://api.ipify.org/?format=json").subscribe(
      res => {
        ip = res;
      }
    );

    this.http.get<any>('https://geolocation-db.com/json/' + ip).subscribe(
      res => {
        this.populateInitial(res.state);
      }
    );
  }

  populateInitial(state){
    //since the response contains un-necessary keys, we need to filter this out
    this.currentState.name = this.filterState(state);
    this.makeInitialCall(this.currentState.name);
  }

  //bunch of if-else.. get rif of them somehow
  filterState(state) : string {
    if(state.includes('Delhi'))
      return "Delhi";
    else if(state.includes('Andaman') || state.includes('Nicobar'))
      return "Andaman and Nicobar Islands";
    else if(state.includes('Andhra'))
      return "Andhra Pradesh";
    else if(state.includes('Arunachal'))
      return "Arunachal Pradesh";
    else if(state.includes('Himachal'))
      return "Himachal Pradesh";
    else if(state.includes('Jammu') || state.includes('Kashmir'))
      return "Jammu and Kashmir";
    else if(state.includes('Madhya'))
      return "Madhya Pradesh";
    else if(state.includes('Tamil'))
      return "Tamil Nadu";
    else
      return state;
  }

  makeInitialCall(state){
    state = encodeURIComponent(state.trim());
    this.http.get<any>('http://covid19-india-adhikansh.herokuapp.com/state/'+state).subscribe(
      res => {
        console.log(res);
        this.currentState.total = res.data[0].total;
        this.currentState.confirmed = res.data[0].confirmed;
        this.currentState.cured = res.data[0].cured;
        this.currentState.death = res.data[0].death;
        this.currentStatePercentage.total = 100;
        this.currentStatePercentage.confirmed = (res.data[0].confirmed/res.data[0].total)*100;
        this.currentStatePercentage.cured = (res.data[0].cured/res.data[0].total)*100;
        this.currentStatePercentage.death = (res.data[0].death/res.data[0].total)*100;
      }
    )
  }
}

export interface State {
  confirmed: number
  cured: number
  death: number
  name: string
  total: number
  _id: string
}


