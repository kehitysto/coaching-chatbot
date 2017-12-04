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
    hash: '66683f9aba0d2b5904fbdf61f105ca3ebea65e56661568f61dc6cb37322cc89612cc26f5d21b17d9a74f008b667ed67358a497d91aa2150d87b5919cc3c8f469' },
  { title: 'Kaarina saa tietää Kaapon hyväksyneen pyynnön',
    hash: '70504afd51552eb411287e9d3429b17a9ae757fbe41861277be3d29d5b70703b8ee7b73bfc5ae7ba1e3522746d041d36a0939c177b329a7c605c18a4364ff004' },
  { title: 'Katariina saa tietää ettei Kaapo ole enää vapaa',
    hash: 'f1a75c95812524f87f15fda9d24afdbe3e5be8de0f8840f97c90ede12d0932f80701416cd1ca8f6c2bc2e8a027aaaf1cd41670386fa5131f7778e500a8b586d9' },
  { title: 'Kaapo saa muistutuksen tapaamisesta',
    hash: 'df9554aa70b5beba8a40dc47af7ee821a0caaae9dbddb1c3c89579d3a88d2a099df056e2fa434799c789c27e881355c707fea0b6156d5238eb65ac96c14ced30' },
  { title: 'Kaapo saa tapaamisen jälkeen pyynnön antaa palautetta',
    hash: '1b5a3df124a1f0bcf1bba19c649a87334931cf727df5deeda97d4168990ee8bee783a09a5239e745ed1770919417c7646c1dd66b6a8d58069d832c3c13406d18' },
  { title: 'Kaarina saa tietää Kaapon palautteesta',
    hash: 'bca68c5acbe6dd79b6516d5b72ddae1c58eb8e2d05355904603c3e14f33e3edf954b76bb8d208da26e2d16a365ca910203c85de94e0acc236b6bf379fe12da4e' },
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
