import * as discussions from '../../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../../doc/flow/states.json';
import * as DiscussionGenerator from '../generate-discussions';
import { keccak512 } from 'js-sha3';

let scenarios;

let checkData = [
  { title: 'Kaapo syöttää tietonsa ja alkaa etsiä paria',
    hash: 'c7b1aa4f2e27f828291d4464daaba3a309e14ffae5b1efc77ed86c08a078b894b290910d592b8be5f7eb8214b8782dae77411d9910c50750df348deb6fa1b5b9' },
  { title: 'Kalle alkaa vaihtaa nimeään',
    hash: '1feaed9ad1ba06383200e6d6a1f3c1ed0157976a505700f694dc116316df44dda146a9a5d5a0e823030a43a4a7beb53c749d30e4a6cd6ec251202c4c84f2970b' },
  { title: 'Katariina on syöttänyt tietonsa ja haluaa nyt etsiä paria',
    hash: '4ed823b8cd43fd0bca6c9dddc0b750faf820c7021af6e1ae6c323f51820b079c1b6e4dddedc018630612d0cb571a13559444973af0cd4fe075cf84b25eb55ca5' },
  { title: 'Kalle saa pyynnön Katariinalta kesken nimen asettamista',
    hash: 'e72d0dc6cd492348a9fe96cbb1af3768279bd32d7ed35d2c775cf1b4d1c1ce856b60ce4219bbc19d54c6b228da39abd5aad5a3aa2ec7c791af75177cb81e1201' },
  { title: 'Katariina muuttaa nimeään ja kuvaustaan',
    hash: '989d683e4ee2195347a83c7b3fdfae9abb107a1661584c7aef643b29248a31122e4b3842a313200e784671ac1a65e8b44dd50b8aa569608d485c01b47a7ea367' },
  { title: 'Katariina muuttaa yhteystietojaan',
    hash: '669edb4fb79f5ffdb530d524e74fed85b2106feac9899f04b5b7d539e29424104062ce7d905e324cfe4005f714547dda50f4cf4f9a84a2beb85b27a84aabe45f' },
  { title: 'Kaarina lähettää pyyntöjä',
    hash: '731a4ae51d98afc54c312b5b501d8f5678b62c6a40334bc2c70f7983147798c2e8865a47cc2bd8c036c556eb9fd088e2fdf77b03c71a025621f08242cf7bc8e9' },
  { title: 'Kaarina hallinnoi pyyntöjä',
    hash: '14c37cbb4a00b9c3b7fd4116ebe9f6998f87967e8976e83c89da568ddcf42dc97161ef230a890f285c29bacaf2681152977c2a8f06357939d0192571f8d38081' },
  { title: 'Kaapo hyväksyy pyynnön ja asettaa tapaamisen ajankohdan',
    hash: '591254c6249856273c3676916786f73a43be3106aed8be9019e86d3939f882d4dcdb64662131640ceebf238b81e1d338ad24e811fb4fbedef0e9820d16256228' },
  { title: 'Kaarina saa tietää Kaapon hyväksyneen pyynnön',
    hash: '70504afd51552eb411287e9d3429b17a9ae757fbe41861277be3d29d5b70703b8ee7b73bfc5ae7ba1e3522746d041d36a0939c177b329a7c605c18a4364ff004' },
  { title: 'Kaapo saa muistutuksen tapaamisesta',
    hash: 'df9554aa70b5beba8a40dc47af7ee821a0caaae9dbddb1c3c89579d3a88d2a099df056e2fa434799c789c27e881355c707fea0b6156d5238eb65ac96c14ced30' },
  { title: 'Kaapo saa tapaamisen jälkeen pyynnön antaa palautetta',
    hash: '8ec49cf00cfc68a6d1a81e85eda76b18fbbfce519984d6d6693cb8039d83c1fccb057fb1799e86e2a82f64ae1adadf82ee26ed5fd1d099b49e72c2bed9b29245' },
  { title: 'Kaarina saa tietää Kaapon palautteesta',
    hash: '3fc48b9b4c26db353b35fd189b369f85c14a190728ad28c127006def76a997cfa329a66a086f3e259f70b13101bffa1c05de560f89f66683bb67893b6b01f6c0' },
  { title: 'Kaapo ei halua enää olla Kaarinan pari',
    hash: '6dfb508e3effd371b80701e7b4bbc4f8d4ad0a8c0c477370edcad49135d9c700ab7a54a6b9b7ab73dcb1f67a08415e870d1196c372cdc95ca68bf04eb0061719' },
  { title: 'Kaarina saa tietää Kaapon rikkoneen parin ja vaihtaa nimensä',
    hash: 'bfca454dd908ada6d32a140bb6a44242b62dd1e66097ca1c74ed5ada6037ee3b2f93df92ad56c22b46d2b82c37a2cdd0c355a5b0a3973382e2391c1b08506fa4' },
];

describe('Automatically generated feature tests', () => {
  before(() => {
    DiscussionGenerator.generate(discussions, states)
      .then(result => {
        scenarios = result;
      });
  });

  for (let i in checkData) {
    describe(checkData[i].title, () => {
      it('should match with the given hash sum', () => {
        return expect(keccak512(scenarios[i].content.join())).to.equal(checkData[i].hash);
      });
    });
  }
});
