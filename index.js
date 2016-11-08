import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.json({
    Hello: 'Введите url+/FIO?fullname=Имя Отчество Фамилия',
  });
});

app.get('/FIO', (req, res) => {
  try {
    if (!req.query.fullname) {
      return res.send('Invalid fullname');
    }
    return res.send(shortedFullName(req.query.fullname));
  } 
  catch (err) {
    console.log(err);
    return res.json({err});
  }
});

app.listen(3000, () => {
  console.log('Task 2B listen port 3000!');
});

/*
  Функция сокращяет входящее имя в формате [Имя]? [Отчество]?  
*/
function shortedFullName(fullname) {
  //[0-9]+|[^a-zA-Zа-яёА-ЯЁ\u0180-\u024F\u0100-\u017F\u00C0-\u00FF\u1E00-\u1EFF\s]
  const illegalName = fullname.match(/[0-9]+|[^a-zA-Zа-яёА-ЯЁ\u0180-\u024F\u0100-\u017F\u00C0-\u00FF\u1E00-\u1EFF\s']/g);
  if (illegalName) {
    return 'Invalid fullname';
  }
    
  const sinitizedName = sanitizeName(fullname);
  
  const spacedChunks = sinitizedName.split(/\s/);
  if (spacedChunks.length > 3) {
    return 'Invalid fullname';
  }

  const SpacedChunks = spacedChunks.map((el,ind, arr)=>{
    return el[0].toUpperCase() + el.substring(1, el.length).toLowerCase();
  });
    
  switch (SpacedChunks.length)  {
    case 1 : return SpacedChunks[0];

    case 2 : return SpacedChunks[1] + ' ' + SpacedChunks[0][0] + '.';

    case 3 : return SpacedChunks[2] + ' ' + SpacedChunks[0][0] + '. ' + SpacedChunks[1][0] + '.';
  };
}

/*
  Функция убирет лишние пробелы, табы и прочие whitespace-символы из входящей строки
*/
function sanitizeName(unsinitizedName) {
  return unsinitizedName.replace(/\s+/g,' ').trim();
}
