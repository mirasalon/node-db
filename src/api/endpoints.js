// You can find the endpoints if you go into the zappa env
// Run zappa status prod and look at API Gateway URL

const ENDPOINT_ENV = "prod";

export default {
  fbAPI: "https://graph.facebook.com/me",

  authServer: {
    local: "http://localhost:5000",
    dev: "https://6kepy39pdi.execute-api.us-west-2.amazonaws.com/dev",
    staging: "https://wl14vad5ya.execute-api.us-west-2.amazonaws.com/staging",
    prod: "https://9pzo1hmsch.execute-api.us-west-2.amazonaws.com/prod"
  }["staging"],

  productServer: {
    local: "http://localhost:5000",
    dev: "https://4s4lo22ly5.execute-api.us-west-2.amazonaws.com/dev",
    staging: "https://co02mz0tac.execute-api.us-west-2.amazonaws.com/staging",
    prod: "https://a9t7temfqj.execute-api.us-west-2.amazonaws.com/prod"
  }["staging"],

  searchServer: {
    local: "http://localhost:5001",
    dev: "https://dy9team43h.execute-api.us-west-2.amazonaws.com/dev",
    staging: "https://ycl641scac.execute-api.us-west-2.amazonaws.com/staging",
    prod: "https://9g5up93t8f.execute-api.us-west-2.amazonaws.com/prod"
  }["dev"],

  profileServer: {
    local: "http://localhost:5000",
    dev: "https://9u7j67fvlf.execute-api.us-west-2.amazonaws.com/dev",
    staging: "https://gmd9i3j6m3.execute-api.us-west-2.amazonaws.com/staging",
    prod: "https://53hb21iptk.execute-api.us-west-2.amazonaws.com/prod"
  }[ENDPOINT_ENV],

  faceInsightsServer: {
    local: "http://192.168.2.162:5000",
    // local: 'http://localhost:5000',
    staging: "http://ec2-35-164-53-88.us-west-2.compute.amazonaws.com:5001",
    prod: "http://ec2-35-164-53-88.us-west-2.compute.amazonaws.com:5000"
    // NOTE: AWS API gateway doesn't allow multipart form data ATM; using http instead for now
    // dev: 'https://n1bxmgi0k0.execute-api.us-west-2.amazonaws.com/dev'
  }["staging"],

  communityServer: {
    local: "http://localhost:5000",
    dev: "https://pai1zwdmpl.execute-api.us-west-2.amazonaws.com/dev",
    staging: "https://qn3pi46ua3.execute-api.us-west-2.amazonaws.com/staging",
    prod: "https://jhzyz07lo4.execute-api.us-west-2.amazonaws.com/prod"
  }[ENDPOINT_ENV],

  ugcCollectionServer: {
    local: "http://localhost:5000",
    dev: "https://oxbemssoce.execute-api.us-west-2.amazonaws.com/dev",
    staging: "https://5jauelt1qb.execute-api.us-west-2.amazonaws.com/staging",
    prod: "https://a1905uhtcg.execute-api.us-west-2.amazonaws.com/prod"
  }[ENDPOINT_ENV]
};
