import '../css/style.css';
import './plugins';
import locations from './store/locations';
import formUI from './views/form';
import ticketsUI from './views/tickets';
import currencyUI from './views/currency';

document.addEventListener('DOMContentLoaded', e => {
  const form = formUI.form;

  // Events
  initApp();
  form.addEventListener('submit', e => {
    e.preventDefault();
    onFormSubmit();
  });

  // handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCities);
  }

  async function onFormSubmit() {
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currecyValue;

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });

    ticketsUI.renderTickets(locations.lastSearch);
    console.log(locations.lastSearch);
  }

  const body=document.body;
  let ticket_id=0;
  body.addEventListener('click', e=> {
    const favoriteList=document.querySelector('.dropdown-content');
    let srcFly='';
    let originCity='';
    let destinyCity='';
    let flyDate='';
    let prise='';
    let info1='';
    let info2='';
    
    let ticket_id_remove="";
      
    if (e.target.classList.contains('add-favorite')&&!e.target.classList.contains('disabled')) {
      e.target.classList.add('disabled');
      e.target.parentNode.children[4].id=ticket_id;
      ticket_id+=1;
      srcFly=e.target.parentNode.children[0].children[0].currentSrc;
      originCity=e.target.parentNode.childNodes[3].children[0].children[0].innerHTML;
      destinyCity=e.target.parentNode.childNodes[3].children[1].children[1].innerHTML;
      flyDate==e.target.parentNode.children[2].children[0].innerHTML;
      prise=e.target.parentNode.children[2].children[1].innerHTML;
      info1=e.target.parentNode.children[3].children[0].innerHTML;
      info2=e.target.parentNode.children[3].children[1].innerHTML;
      //console.log(e.target.parentNode);
      //dropdown-content
      favoriteList.insertAdjacentHTML('afterbegin', `
        <div class="favorite-item  d-flex align-items-start">
                <img
                  src="${srcFly}"
                  class="favorite-item-airline-img"
                />
                <div class="favorite-item-info d-flex flex-column">
                  <div
                    class="favorite-item-destination d-flex align-items-center"
                  >
                    <div class="d-flex align-items-center mr-auto">
                      <span class="favorite-item-city">${originCity}</span>
                      <i class="medium material-icons">flight_takeoff</i>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="medium material-icons">flight_land</i>
                      <span class="favorite-item-city">${destinyCity}</span>
                    </div>
                  </div>
                  <div class="ticket-time-price d-flex align-items-center">
                    <span class="ticket-time-departure">${flyDate}</span>
                    <span class="ticket-price ml-auto">${prise}</span>
                  </div>
                  <div class="ticket-additional-info">
                    <span class="ticket-transfers">${info1}</span>
                    <span class="ticket-flight-number">${info2}</span>
                  </div>
                  <a
                    class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto " id="${ticket_id-1}"
                    >Delete</a
                  >
                </div>
              </div>
      `);
    };

    if(e.target.classList.contains('delete-favorite')) {
      ticket_id_remove=e.target.id;
      e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
      const currentTicketList=document.querySelectorAll('.ticket-card');
      for (let i=0;i<=currentTicketList.length-1;i++){
        if (currentTicketList[i].children[4].id===ticket_id_remove) {
          currentTicketList[i].children[4].classList.remove('disabled');
          currentTicketList[i].children[4].id='';
        }
      }
      //console.dir(currentTicketList);
      
    };

    
  });
});

// *1 - создать отдельный метод для получения airlines
// *2 - в init добавить получение airlines
// *3 - serializeAirlines
// *4 - serializeTickets и переделать serializeCities и createShortCities и getCityCodeByKey
// *5 - новые методы getAirlineNameByCode, getAirlineLogoByCode, getCityNameByCode
// *6 - TicketsUI
