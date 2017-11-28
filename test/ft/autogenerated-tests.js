import * as discussions from '../../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../../doc/flow/states.json';
import * as DiscussionGenerator from '../generate-discussions';
import { keccak512 } from 'js-sha3';

let scenarios;

let checkData = [
  {
    title: 'Kaapo syöttää tietonsa ja alkaa etsiä paria',
    hash: 'b4ede2df9bba502421355ce327cf962dd4daa1d1e3d600ad613fbaa40de436175549d5a1479d9e6ceb898d55033653b4ec76803282faed40f35aded1c150f2cf'
  },
  {
    title: 'Katariina on syöttänyt tietonsa ja haluaa nyt etsiä paria',
    hash: '4ed823b8cd43fd0bca6c9dddc0b750faf820c7021af6e1ae6c323f51820b079c1b6e4dddedc018630612d0cb571a13559444973af0cd4fe075cf84b25eb55ca5'
  },
  {
    title: 'Katariina muuttaa tietojaan',
    hash: '83a7d4268160aa0771fb3c5b595d3caf5455ea6f24f07de4f9bdf052b7c2cd7bf90ee36b16d80160f835fc05311f6596a8abc3f0dfbb68da74d0b1fc59cd95d8'
  },
  {
    title: 'Kaarina lähettää ja hallinnoi pyyntöjä',
    hash: '3725ae877808dae674db9876367c685d693e9cfeb34e62ddeaef5320c370e3cbf3c9eb3d65b3e60ee9bd478d210ed1fd301063cbf232ab2c6224385e7ddd246f'
  },
  {
    title: 'Kaapo hyväksyy pyynnön ja asettaa tapaamisen ajankohdan',
    hash: '591254c6249856273c3676916786f73a43be3106aed8be9019e86d3939f882d4dcdb64662131640ceebf238b81e1d338ad24e811fb4fbedef0e9820d16256228'
  },
  {
    title: 'Kaarina saa tietää Kaapon hyväksyneen pyynnön',
    hash: '70504afd51552eb411287e9d3429b17a9ae757fbe41861277be3d29d5b70703b8ee7b73bfc5ae7ba1e3522746d041d36a0939c177b329a7c605c18a4364ff004'
  },
  {
    title: 'Kaapo saa muistutuksen tapaamisesta',
    hash: 'df9554aa70b5beba8a40dc47af7ee821a0caaae9dbddb1c3c89579d3a88d2a099df056e2fa434799c789c27e881355c707fea0b6156d5238eb65ac96c14ced30'
  },
  {
    title: 'Kaapo saa tapaamisen jälkeen pyynnön antaa palautetta',
    hash: '8ec49cf00cfc68a6d1a81e85eda76b18fbbfce519984d6d6693cb8039d83c1fccb057fb1799e86e2a82f64ae1adadf82ee26ed5fd1d099b49e72c2bed9b29245'
  },
  {
    title: 'Kaarina saa tietää Kaapon palautteesta',
    hash: '3fc48b9b4c26db353b35fd189b369f85c14a190728ad28c127006def76a997cfa329a66a086f3e259f70b13101bffa1c05de560f89f66683bb67893b6b01f6c0'
  },
  {
    title: 'Kaapo ei halua enää olla Kaarinan pari',
    hash: '6dfb508e3effd371b80701e7b4bbc4f8d4ad0a8c0c477370edcad49135d9c700ab7a54a6b9b7ab73dcb1f67a08415e870d1196c372cdc95ca68bf04eb0061719'
  },
  {
    title: 'Kaarina saa tietää Kaapon rikkoneen parin ja vaihtaa nimensä',
    hash: 'bfca454dd908ada6d32a140bb6a44242b62dd1e66097ca1c74ed5ada6037ee3b2f93df92ad56c22b46d2b82c37a2cdd0c355a5b0a3973382e2391c1b08506fa4'
  },
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