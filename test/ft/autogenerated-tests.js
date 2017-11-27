import * as discussions from '../../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../../doc/flow/states.json';
import * as DiscussionGenerator from '../generate-discussions';
import { keccak512 } from 'js-sha3';

let scenarios;

let checkData = [
  { title: 'Kaapo syöttää tietonsa ja alkaa etsiä paria',
    hash: '754eca5ca003df42fc9a577d45cd35bbdc78e33bb6d2c79cd0095cd6acc6f5eb366144b0420f9e63e0d5f8f35f195af8a92e6deeb64fee77416458e79ea27e82' },
  { title: 'Katariina on syöttänyt tietonsa ja haluaa nyt etsiä paria',
    hash: 'e0e4a1d9844fbcb63e177e97d37a869c6b3db8c9357d48d356907f042cf48c8a83d527919e52de37287140256c8ff4d1c23180418c6046d1fb9daa861ede0361' },
  { title: 'Katariina muuttaa tietojaan',
    hash: '83a7d4268160aa0771fb3c5b595d3caf5455ea6f24f07de4f9bdf052b7c2cd7bf90ee36b16d80160f835fc05311f6596a8abc3f0dfbb68da74d0b1fc59cd95d8' },
  { title: 'Kaarina lähettää ja hallinnoi pyyntöjä',
    hash: 'd108df3c10c9cd6cca418e485d5ca6151650293729445a5554725fade87ef4702fa5d873911f7d43c09f342a9470795d9a28700b049ce44ce2f481692934136a' },
  { title: 'Kaapo hyväksyy pyynnön ja asettaa tapaamisen ajankohdan',
    hash: 'aab9251ebc3dcad468dfe5d8820bea9189af56749269aa507551dea02ec3a5f905d59897b39884678fa3da1fd86e3eab37f57ae2fa2ceb0bdc42cff4b22603e8' },
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
