/**
 * Copyright 2018 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const extend = require('extend');

/**
 * Create or update expansion list.
 *
 * Create or replace the Expansion list for this collection. The maximum number of expanded terms per collection is `500`. The current expansion list is replaced with the uploaded content.
 *
 * @param {Object} params - The parameters to send to the service.
 * @param {string} [params.username] - The username used to authenticate with the service. Username and password credentials are only required to run your application locally or outside of Bluemix. When running on Bluemix, the credentials will be automatically loaded from the `VCAP_SERVICES` environment variable.
 * @param {string} [params.password] - The password used to authenticate with the service. Username and password credentials are only required to run your application locally or outside of Bluemix. When running on Bluemix, the credentials will be automatically loaded from the `VCAP_SERVICES` environment variable.
 * @param {string} [params.iam_access_token] - An IAM access token fully managed by the application. Responsibility falls on the application to refresh the token, either before it expires or reactively upon receiving a 401 from the service, as any requests made with an expired token will fail.
 * @param {string} [params.iam_apikey] - An API key that can be used to request IAM tokens. If this API key is provided, the SDK will manage the token and handle the refreshing.
 * @param {string} [params.iam_url] - An optional URL for the IAM service API. Defaults to 'https://iam.ng.bluemix.net/identity/token'.
 * @param {Object} [params.headers] - Custom HTTP request headers
 * @param {boolean} [params.headers.X-Watson-Learning-Opt-Out=false] - opt-out of data collection
 * @param {string} [params.url] - override default service base url
 * @param {string} params.version - Release date of the API version in YYYY-MM-DD format.
 * @param {string} params.environment_id - The ID of the environment.
 * @param {string} params.collection_id - The ID of the collection.
 * @param {Expansion[]} params.expansions - An array of query expansion definitions.    Each object in the `expansions` array represents a term or set of terms that will be expanded into other terms. Each expansion object can be configured so that all terms are expanded to all other terms in the object - bi-directional, or a set list of terms can be expanded into a second list of terms - uni-directional.   To create a bi-directional expansion specify an `expanded_terms` array. When found in a query, all items in the `expanded_terms` array are then expanded to the other items in the same array.   To create a uni-directional expansion, specify both an array of `input_terms` and an array of `expanded_terms`. When items in the `input_terms` array are present in a query, they are expanded using the items listed in the `expanded_terms` array.
 * @return {Promise} - The Promise that the action returns.
 */
function main(params) {
  return new Promise((resolve, reject) => {
    const _params = getParams(params, 'discovery');
    _params.headers = extend({}, _params.headers, { 'User-Agent': 'openwhisk' });
    let service;
    try {
      service = new DiscoveryV1(_params);
      service.createExpansions(_params, (err, response) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject(err.message);
      return;
    }
  });
}

/**
* Helper function used to authenticate credentials bound to package using wsk service bind
*
* @param {Object} theParams - parameters sent to service
* @param {string} service - name of service in bluemix used to retrieve credentials
*/
function getParams(theParams, service) {
  if (Object.keys(theParams).length === 0) {
    return theParams;
  }
  const bxCreds = theParams.__bx_creds ? theParams.__bx_creds[service] : {};
  const _params = Object.assign({}, bxCreds, theParams);
  delete _params.__bx_creds;
  return _params;
}

global.main = main;
module.exports.test = main;