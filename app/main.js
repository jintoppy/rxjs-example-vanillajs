import axios from 'axios';
import Rx from 'rxjs';

let url = 'https://api.github.com/users/';
let input = document.querySelector('input')
let inputStream = Rx.Observable.fromEvent(input, 'input')

let result = document.querySelector('#result');

let responseStream = inputStream
  .debounceTime(500)
  .map(e => e.target.value)
  .filter(value => !value || value.length > 2)
  .distinctUntilChanged()
  .switchMap(
    value => value ? Rx.Observable
                        .fromPromise(axios.get(`${url}${value}`))
                        .catch(error => {
                            console.log("Caught Error, continuing")
                            return Rx.Observable.of({data: 'No user found'})
                        })
                         : Rx.Observable.of({data: 'Enter some username'})
  );

responseStream
.subscribe(({ data }) => {
    result.innerHTML = `
        <h2>Response is</h2>
        <div>
            ${JSON.stringify(data)}
        </div>
    `;
},
 err => result.innerHTML = `No result found`
);
