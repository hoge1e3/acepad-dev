#!run
  import { Document, Charset } from "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.compact.module.min.js";

export async function main(){
  const log=(str)=>{
    this.echo(str);
  };


  // some test data
  const data = [{
    "tconst": "tt0000001",
    "titleType": "short",
    "primaryTitle": "Carmencita",
    "originalTitle": "Carmencita",
    "isAdult": 0,
    "startYear": "1894",
    "endYear": "",
    "runtimeMinutes": "1",
    "genres": [
      "Documentary",
      "Short"
    ]
  },{
    "tconst": "tt0000002",
    "titleType": "short",
    "primaryTitle": "Le clown et ses chiens",
    "originalTitle": "Le clown et ses chiens",
    "isAdult": 0,
    "startYear": "1892",
    "endYear": "",
    "runtimeMinutes": "5",
    "genres": [
      "Animation",
      "Short"
    ]
  }];

  // create the document index
  const index = new Document({
    document: {
      id: "tconst",
      store: true,
      index: [{
        field: "primaryTitle",
        tokenize: "forward",
        encoder: Charset.LatinBalance
      },{
        field: "originalTitle",
        tokenize: "forward",
        encoder: Charset.LatinBalance
      }],
      tag: [{
        field: "startYear"
      },{
        field: "genres"
      }]
    }
  });

  // add test data
  for(let i = 0; i < data.length; i++){
    index.add(data[i]);
  }

  // perform a query + enrich results
  const result = index.search({
    query: "karmen",
    tag: {
      "startYear": "1894",
      "genres": [
        "Documentary",
        "Short"
      ]
    },
    enrich: true,
  });

  // display results
  console.log("res",result);
  main2();
  return;
}
function main2(){
  
    const index = new Document({
      document: {
        store:true,
          id: "id",
          index: ["path",/*"timestamp",*/"content"],
      }
  });
  
  // add documents to the index
  index.add({ 
      id: 0, 
      path:"/tmp/test.txt",
      timestamp:10000,
      content: "some text"
  });
  const r=index.search({
    query:"test",
    index: "path" ,
    enrich:true,
  //    merge:true,
  });
  
  console.log(r);
  return;

}
function rest(){
  log(JSON.stringify(result, null, 2));
  log("\n-------------------------------------\n");

  // perform a query + merge results
  const merged = index.search({
    query: "karmen",
    tag: {
      "startYear": "1894",
      "genres": [
        "Documentary",
        "Short"
      ]
    },
    enrich: true,
    merge: true
  });

  // display results
  console.log(merged);
  log(JSON.stringify(merged, null, 2));
  log("\n-------------------------------------\n");

  // perform a query + get suggestions
  const suggestions = index.search({
    query: "karmen or clown or not found",
    tag: {
      // no data for this category:
      "genres": "Movie"
    },
    suggest: true,
    enrich: true,
    merge: true
  });

  // display results
  console.log(suggestions);
  log(JSON.stringify(suggestions, null, 2));

}