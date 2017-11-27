import * as discussions from '../../doc/flow/discussions.json';
import * as path from 'path';
import * as states from '../../doc/flow/states.json';
import * as DiscussionGenerator from '../generate-discussions';
import { keccak512 } from 'js-sha3';

let scenarios;

describe('Automatically generated feature tests', () => {
  before(() => {
    DiscussionGenerator.generate(discussions, states)
      .then(result => {
         scenarios = result;
      });
  });

  describe('Kaapo syöttää tietonsa ja alkaa etsiä paria', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[0].content.join())).to.equal('94de890eb8e569ebcf9a855e043f50ad6a0a2cc1e5aa7c88cc4d4f2d50391e81abe3d6d12e7ce7841752546ee1dffc9e9c28ca29404c3c558bb83b89aafa2312');
    });
  });

  describe('Katariina on syöttänyt tietonsa ja haluaa nyt etsiä paria. Katariina muuttaa tietojansa.', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[1].content.join())).to.equal('533a3c4a5a7aa9f779ff9695efee675262acd6b1150bdc8bf83243332b0962ea38cb556007f2e422d45dbf120fa6a64aabe154612e16bfd34d47e73d8ceda222');
    });
  });

  describe('Kaarina lähettää ja hallinnoi pyyntöjä', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[2].content.join())).to.equal('6410eda68822aa5c8ec6258fcaed78ad08844f5710e6a283f98699a1987920aa80efeb6014f6ab45d1d7ca1d23e7ca4138e379a17ff84525fd3334d3a3232526');
    });
  });

  describe('Kaapo hyväksyy pyynnön ja asettaa tapaamisen ajankohdan', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[3].content.join())).to.equal('aab9251ebc3dcad468dfe5d8820bea9189af56749269aa507551dea02ec3a5f905d59897b39884678fa3da1fd86e3eab37f57ae2fa2ceb0bdc42cff4b22603e8');
    });
  });

  describe('Kaarina saa tietää Kaapon hyväksyneen pyynnön', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[4].content.join())).to.equal('70504afd51552eb411287e9d3429b17a9ae757fbe41861277be3d29d5b70703b8ee7b73bfc5ae7ba1e3522746d041d36a0939c177b329a7c605c18a4364ff004');
    });
  });

  describe('Kaapo saa muistutuksen tapaamisesta', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[5].content.join())).to.equal('df9554aa70b5beba8a40dc47af7ee821a0caaae9dbddb1c3c89579d3a88d2a099df056e2fa434799c789c27e881355c707fea0b6156d5238eb65ac96c14ced30');
    });
  });

  describe('Kaapo saa tapaamisen jälkeen pyynnön antaa palautetta', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[6].content.join())).to.equal('8ec49cf00cfc68a6d1a81e85eda76b18fbbfce519984d6d6693cb8039d83c1fccb057fb1799e86e2a82f64ae1adadf82ee26ed5fd1d099b49e72c2bed9b29245');
    });
  });

  describe('Kaarina saa tietää Kaapon palautteesta', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[7].content.join())).to.equal('3fc48b9b4c26db353b35fd189b369f85c14a190728ad28c127006def76a997cfa329a66a086f3e259f70b13101bffa1c05de560f89f66683bb67893b6b01f6c0');
    });
  });

  describe('Kaapo ei halua enää olla Kaarinan pari', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[8].content.join())).to.equal('0bc34285cdbdfae1d993960cc311031c6e00d824d31ad6072db6877915ab16ad7a52dcfaa0e16f0ab60fb32156394ac917e6cc3adfafbd8891ea0a26c9f861d1');
    });
  });

  describe('Kaarina saa tietää Kaapon rikkoneen parin ja vaihtaa nimensä', () => {
    it('should match with the given hash sum', () => {
      return expect(keccak512(scenarios[9].content.join())).to.equal('7b2be0e7d61bfd79210212292f2e4f7f63cec549c8c3bc4660f439b7e8ae6d6a42b1a0bbed32de410464b5b708434998d7eda1a0f1d7b1cc49cea5087eeae702');
    });
  });
});
