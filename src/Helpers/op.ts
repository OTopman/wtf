/* eslint-disable require-jsdoc */
export default class Op {
  private acronyms: any[];
  private queryString: any;
  private moreResult: boolean = false;
  private totalPages?: number;
  constructor(query: any, queryString: any) {
    this.acronyms = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    this.acronyms = queryObj['search'] ? this.acronyms.filter(function (v: number, i: number, acronyms: any[]) {
      if (Object.values(acronyms[i]).every((str) => String(str).toLowerCase().includes(queryObj['search'].toLowerCase()))) return true;
      return false;
    }) : this.acronyms;
    this.totalPages = this.acronyms.length / (Number(this.queryString.limit) || 1);

    return this;
  }

  paginate() {
    const page = this.queryString.from * 1 || 1;
    const limit = this.queryString.limit * 1 || this.acronyms.length;
    const skip = (page - 1) * limit;
    const newAcronyms = [];
    let counter = 0;

    for (let i = 0; i < this.acronyms.length; i++) {
      const acronym = this.acronyms[i];
      if (counter == limit) break;
      if (i >= skip) {
        counter += 1;
        if (i < Number(limit + skip)) {
          newAcronyms.push(acronym);
        }
      }
    }
    this.moreResult = this.totalPages! > page;
    return this;
  }
}
