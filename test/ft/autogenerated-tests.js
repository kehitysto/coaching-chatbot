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
    hash: '98a4392594552405deff4ce418ab61007e594342d4bb0db5d86d83280fe1f493984d4bf49a8fb3a112694a68b2c302826c7126016fcdf24cded97b638e10a49f' },
  { title: 'Katariina lähettää pyynnön Kaapolle ja Kaarinalle',
    hash: '5c0839688182066adb6f9e2a47c3e951d09a24fe1bbc4031e42009873df227a5deadbecc31f81c3223695a508a805c1e5754bfb5b61dc78d99d7b266314d21d6' },
  { title: 'Kalle saa pyynnön Katariinalta kesken nimen asettamista',
    hash: '84be0a56cb5b21cf09fc11032580fe88952e1bde938d53d76b1deefb1bd8e606ef69dfe2f08c0cb11955e2b3284cd25ce094539a425edcc2e2e724b98803fae5' },
  { title: 'Kalle hylkää Katariinan pyynnön',
    hash: '106139f3b0f8bc5bf894ecc11e05fc775921a772ddbdfea144eb02e979d312dd45a56bf6631c4d7db62e3faac7cc0af392eb4dde5d6aff5f4a5cd784474a737a' },
  { title: 'Kaarina hylkää Katariinan pyynnön',
    hash: '2f0be830a6a38bfdf66153b5594757e551f69050290388c4a3c3e0de7b5fab9d7c039207256df3322e05787ef748f492a556886be6fccd73393fb939b646b1f1' },
  { title: 'Katariina saa kahdelta henkilöltä hylkäyksen',
    hash: '17fafa8fc59e103886e1f3a243468b408854cff7cc219b86f8c8ddc8d849168508dae6fdf9f87dade64dbd4eb34c8768aca7b1200757528fb1c7257c524f9479' },
  { title: 'Katariina muuttaa nimeään ja kuvaustaan',
    hash: '989d683e4ee2195347a83c7b3fdfae9abb107a1661584c7aef643b29248a31122e4b3842a313200e784671ac1a65e8b44dd50b8aa569608d485c01b47a7ea367' },
  { title: 'Katariina muuttaa yhteystietojaan',
    hash: '669edb4fb79f5ffdb530d524e74fed85b2106feac9899f04b5b7d539e29424104062ce7d905e324cfe4005f714547dda50f4cf4f9a84a2beb85b27a84aabe45f' },
  { title: 'Kaarina lähettää pyyntöjä',
    hash: '091a193e3f2e5d320ec62c82ccf86e319884e7514ee31a4b886c227ee2c0eae88788372eba8e83ff64c1f85d351b98eb282b257932969176562486480c9d880c' },
  { title: 'Kaarina hallinnoi pyyntöjä',
    hash: '9334053e2af72a529dfccb77b8b7e6a9b322b3244c6568bd1c0d62843a3338e03ec59f53591ea249ce55c467f124e7199d637d3c2da7f1ede8038fdaf6274669' },
  { title: 'Kaapo hyväksyy pyynnön ja asettaa tapaamisen ajankohdan',
    hash: '200036e1613fe8d84a78a14bcbac41f3b8897a15e1c9a6d750baa53d2c8aaadd74bd9158410ba40807feccfcdb5970ffc7a5f97e27fef4750cd71dcea5378af8' },
  { title: 'Kaarina saa tietää Kaapon hyväksyneen pyynnön',
    hash: 'b73e508d6b87d7ec84b77b94403564f00743fbbad22aba30dc266273940928b4caf760585ac0206541ff3ff63f1c2cf4f0b85e48640c7930e70e10b941102fa9' },
  { title: 'Katariina saa tietää ettei Kaapo ole enää vapaa',
    hash: 'f1a75c95812524f87f15fda9d24afdbe3e5be8de0f8840f97c90ede12d0932f80701416cd1ca8f6c2bc2e8a027aaaf1cd41670386fa5131f7778e500a8b586d9' },
  { title: 'Kaapo saa muistutuksen tapaamisesta',
    hash: 'c82c3b8fb57b15092fa2701c54a9f24fa32b894129f04839368f36e60a675bb15757d6ee317f9d9efe8158559b569771973342ea42b14aeea2f64dbeaf10ce13' },
  { title: 'Kaapo saa tapaamisen jälkeen pyynnön antaa palautetta',
    hash: '1b5a3df124a1f0bcf1bba19c649a87334931cf727df5deeda97d4168990ee8bee783a09a5239e745ed1770919417c7646c1dd66b6a8d58069d832c3c13406d18' },
  { title: 'Kaarina saa tietää Kaapon palautteesta',
    hash: 'bca68c5acbe6dd79b6516d5b72ddae1c58eb8e2d05355904603c3e14f33e3edf954b76bb8d208da26e2d16a365ca910203c85de94e0acc236b6bf379fe12da4e' },
  { title: 'Kaapo ei halua enää olla Kaarinan pari',
    hash: '1ea3645bf564cadce11b2c79ca3ea8d7ae6d515277368ce48adbe8a4a7e9db7b01c563a0fa8bdd7b4dd749b671821782f5b3edf83a64dc461476c37b14ec3af1' },
  { title: 'Kaarina saa tietää Kaapon rikkoneen parin ja vaihtaa nimensä',
    hash: '5627d473003262d12300e08ce3367bc18b15f3ef1653bdac168752714e57135cd99e03c651ca749844921756909e75c689815466c8599e682819cacb0617a8d3' },
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
