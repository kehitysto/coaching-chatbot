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
  { title: 'Katariina muuttaa tietojaan',
    hash: '83a7d4268160aa0771fb3c5b595d3caf5455ea6f24f07de4f9bdf052b7c2cd7bf90ee36b16d80160f835fc05311f6596a8abc3f0dfbb68da74d0b1fc59cd95d8' },
  { title: 'Kaarina lähettää pyyntöjä',
    hash: '24d56e7c2e6f23e460b58373609d12d74614a90a8daa6f60b3456bf66b9f413a77391f0fcd857ed4568b7eb8e1384b3b39432d423b79354f3ad0abed36bea57d' },
  { title: 'Kaarina hallinnoi pyyntöjä',
    hash: 'bd4bf1d6bd98bf12b488953e3be4956f72be3a7183432368ca333bede88433474cdb55ba08fa599d224bd86c7cd9a19665ed629371cb8611de19c3c1cfb55a37' },
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
    hash: '26f91f60335a68ae18dcc3123d98fa0fc02fc753e3edda6efd4891fb1520eee950153c8d8b1954fc0d92c01f3443a5809b104b7236b7a67a29bb1721fc417bba' },
  { title: 'Kaarina saa tietää Kaapon rikkoneen parin ja vaihtaa nimensä',
    hash: '802f7ffd58eb649cea3dd88203d26372af6ed6ce679795b093d73ea8ba43d9994bddeab78f43d6728af81fb1b6c66cfa02895b286a4602fc778ea64cae431f88' },
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
