const tourId=new URLSearchParams(location.search).get('tour');
if(tourId){import('./tour-viewer.js').then(m=>m.openPublishedTour(tourId));}else{import('./main-app.js');}
