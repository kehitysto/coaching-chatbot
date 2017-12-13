import * as discussions from '../../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../../doc/flow/states.json';
import * as DiscussionGenerator from '../generate-discussions';
import { keccak512 } from 'js-sha3';

let scenarios;

let checkData = [
  { title: 'Kaapo syöttää tietonsa ja alkaa etsiä paria',
    hash: '4782d9f60e8e37c613276dbdce5bfb3f900bf2a21277ba4edaf2a27a85cd331078b1eeea48fcc183ea87897b6ca79d83e5daf7ec111cff4e7210d8b0dca6002e' },
  { title: 'Kalle alkaa vaihtaa nimeään',
    hash: '1feaed9ad1ba06383200e6d6a1f3c1ed0157976a505700f694dc116316df44dda146a9a5d5a0e823030a43a4a7beb53c749d30e4a6cd6ec251202c4c84f2970b' },
  { title: 'Katariina on syöttänyt tietonsa ja haluaa nyt etsiä paria',
    hash: '98a4392594552405deff4ce418ab61007e594342d4bb0db5d86d83280fe1f493984d4bf49a8fb3a112694a68b2c302826c7126016fcdf24cded97b638e10a49f' },
  { title: 'Katariina lähettää pyynnön Kaapolle ja Kaarinalle',
    hash: 'd6bf3b0c61ce71c2dd0a9f9f96954c95129cf34f87d458107b571f5ed3a8aba7a3486188cc4e369d99982dcdb438caa4b484a3e5ee14a35d8d0246be568eae36' },
  { title: 'Kalle saa pyynnön Katariinalta kesken nimen asettamista',
    hash: '2ab40a199522bcdd437ef2a62ef5928c929ec3e070231ad531d82702589b624415f3c274b89b71d4c8dcc884e272d515caaded99b78c6d8bf403580706aed292' },
  { title: 'Kalle hylkää Katariinan pyynnön',
    hash: '88ad67109104cceb8605ccbb2377cab16406df87471908f1666ca2d407f9255f7aee67a75d6140c554e98cc579c8968fb66a4805b08eb5477744248ae20277f4' },
  { title: 'Kaarina hylkää Katariinan pyynnön',
    hash: '7105be7b30d63ae5347a9b51b30a62618b9eb5caa6980382c69faee924876882046865b6fbc687f1eb3c7eaea0baaa45dacc52db2a02cad7b6d4e1d3f81493be' },
  { title: 'Katariina saa kahdelta henkilöltä hylkäyksen',
    hash: 'eedeec4b9de2c964a6375e031390724784f9932d97b55fc6b9e6aa485a7e2ba9c85a8fcc3b88b2d322d607dbaac110b337d9dcb513e5ee25403a264cc95d48a9' },
  { title: 'Katariina muuttaa nimeään ja kuvaustaan',
    hash: '989d683e4ee2195347a83c7b3fdfae9abb107a1661584c7aef643b29248a31122e4b3842a313200e784671ac1a65e8b44dd50b8aa569608d485c01b47a7ea367' },
  { title: 'Katariina muuttaa yhteystietojaan',
    hash: '66d484d69322aaf0c4ba67ffea640113dc39516ffd34c72e11cf3698841a12771b9b6cf4411bd40e3c0c61dcf114ec46ed1b85844661a90783ec7b25eccce7f7' },
  { title: 'Kaarina lähettää pyyntöjä',
    hash: 'ea5b324a5db56923519cd6a1a1b9f963ba4342cfb2b9d9bc6ed988ed2218664818bf6aebea5ed760b8d80e1915681cab83e49d5bb8565fa34d57605746c8b8f6' },
  { title: 'Kaarina hallinnoi pyyntöjä',
    hash: '7b1af96cd82f26a5a219b9b46fdbff023149c8bd6058b88c23da89364118ddec323f700b496bb985e2470c91ac631ac03056283025fa68c3266b39b8794f0c61' },
  { title: 'Kaapo hyväksyy pyynnön ja asettaa tapaamisen ajankohdan',
    hash: '1b6260029127c1b94a481d37663ce5e14fa88c705db36d898e630151c0a237a954e3ca4ac9f07221305b5f2fa1477ee4e36298373a8223fbade46f9452148a08' },
  { title: 'Kaarina saa tietää Kaapon hyväksyneen pyynnön',
    hash: 'b73e508d6b87d7ec84b77b94403564f00743fbbad22aba30dc266273940928b4caf760585ac0206541ff3ff63f1c2cf4f0b85e48640c7930e70e10b941102fa9' },
  { title: 'Katariina saa tietää ettei Kaapo ole enää vapaa',
    hash: '7bbd49e5a0b8fd83d355c44a0f79b5ef68a38d72762551f11c1c11fccf386d0896dd94ab64dc131d9fd250a69c8ad5c710d19984e192527a0c7c3dd95853ff74' },
  { title: 'Kaapo saa muistutuksen tapaamisesta',
    hash: 'c82c3b8fb57b15092fa2701c54a9f24fa32b894129f04839368f36e60a675bb15757d6ee317f9d9efe8158559b569771973342ea42b14aeea2f64dbeaf10ce13' },
  { title: 'Kaapo saa tapaamisen jälkeen pyynnön antaa palautetta',
    hash: '1b5a3df124a1f0bcf1bba19c649a87334931cf727df5deeda97d4168990ee8bee783a09a5239e745ed1770919417c7646c1dd66b6a8d58069d832c3c13406d18' },
  { title: 'Kaarina saa tietää Kaapon palautteesta',
    hash: 'bca68c5acbe6dd79b6516d5b72ddae1c58eb8e2d05355904603c3e14f33e3edf954b76bb8d208da26e2d16a365ca910203c85de94e0acc236b6bf379fe12da4e' },
  { title: 'Kaapo ei halua enää olla Kaarinan pari',
    hash: 'e649467a7bf24a32d899b76c67140181328547ae913eb4fdd6e5ed4a783dc6b70c3317287be0948299c41859d5acd71525ad32b2af29fb320dc4cc1de4483152' },
  { title: 'Kaarina saa tietää Kaapon rikkoneen parin ja vaihtaa nimensä',
    hash: 'f684f14a31b244614c8a0338cfc15b7e0202a7de82459e46f8fd4215834cd7e969772ef6dfad818a6b8661d5b6f65a09b4bc907b4b0f11689c948149693d5935' },
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
        return expect(keccak512(scenarios[i].content.join()),
            'Run \'npm run visualize\' and ' +
            'check \'' + checkData[i].title + '\' in ' +
            'doc/flow/discussions.md. If it looks fine, copy ' +
            'the hash from automatically generated tests ' +
            'in the same document.')
          .to.equal(checkData[i].hash);
      });
    });
  }
});
