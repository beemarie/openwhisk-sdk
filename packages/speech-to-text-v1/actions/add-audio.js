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

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const extend = require('extend');

/**
 * Add an audio resource.
 *
 * Adds an audio resource to a custom acoustic model. Add audio content that reflects the acoustic characteristics of
 * the audio that you plan to transcribe. You must use credentials for the instance of the service that owns a model to
 * add an audio resource to it. Adding audio data does not affect the custom acoustic model until you train the model
 * for the new data by using the **Train a custom acoustic model** method.
 *
 * You can add individual audio files or an archive file that contains multiple audio files. Adding multiple audio files
 * via a single archive file is significantly more efficient than adding each file individually. You can add audio
 * resources in any format that the service supports for speech recognition.
 *
 * You can use this method to add any number of audio resources to a custom model by calling the method once for each
 * audio or archive file. But the addition of one audio resource must be fully complete before you can add another. You
 * must add a minimum of 10 minutes and a maximum of 50 hours of audio that includes speech, not just silence, to a
 * custom acoustic model before you can train it. No audio resource, audio- or archive-type, can be larger than 100 MB.
 * To add an audio resource that has the same name as an existing audio resource, set the `allow_overwrite` parameter to
 * `true`; otherwise, the request fails.
 *
 * The method is asynchronous. It can take several seconds to complete depending on the duration of the audio and, in
 * the case of an archive file, the total number of audio files being processed. The service returns a 201 response code
 * if the audio is valid. It then asynchronously analyzes the contents of the audio file or files and automatically
 * extracts information about the audio such as its length, sampling rate, and encoding. You cannot submit requests to
 * add additional audio resources to a custom acoustic model, or to train the model, until the service's analysis of all
 * audio files for the current request completes.
 *
 * To determine the status of the service's analysis of the audio, use the **Get an audio resource** method to poll the
 * status of the audio. The method accepts the customization ID of the custom model and the name of the audio resource,
 * and it returns the status of the resource. Use a loop to check the status of the audio every few seconds until it
 * becomes `ok`.
 *
 * ### Content types for audio-type resources
 *
 *  You can add an individual audio file in any format that the service supports for speech recognition. For an
 * audio-type resource, use the `Content-Type` parameter to specify the audio format (MIME type) of the audio file:
 * * `audio/basic` (Use only with narrowband models.)
 * * `audio/flac`
 * * `audio/l16` (Specify the sampling rate (`rate`) and optionally the number of channels (`channels`) and endianness
 * (`endianness`) of the audio.)
 * * `audio/mp3`
 * * `audio/mpeg`
 * * `audio/mulaw` (Specify the sampling rate (`rate`) of the audio.)
 * * `audio/ogg` (The service automatically detects the codec of the input audio.)
 * * `audio/ogg;codecs=opus`
 * * `audio/ogg;codecs=vorbis`
 * * `audio/wav` (Provide audio with a maximum of nine channels.)
 * * `audio/webm` (The service automatically detects the codec of the input audio.)
 * * `audio/webm;codecs=opus`
 * * `audio/webm;codecs=vorbis`
 *
 * For information about the supported audio formats, including specifying the sampling rate, channels, and endianness
 * for the indicated formats, see [Audio
 * formats](https://console.bluemix.net/docs/services/speech-to-text/audio-formats.html).
 *
 * **Note:** The sampling rate of an audio file must match the sampling rate of the base model for the custom model: for
 * broadband models, at least 16 kHz; for narrowband models, at least 8 kHz. If the sampling rate of the audio is higher
 * than the minimum required rate, the service down-samples the audio to the appropriate rate. If the sampling rate of
 * the audio is lower than the minimum required rate, the service labels the audio file as `invalid`.
 *
 * ### Content types for archive-type resources
 *
 *  You can add an archive file (**.zip** or **.tar.gz** file) that contains audio files in any format that the service
 * supports for speech recognition. For an archive-type resource, use the `Content-Type` parameter to specify the media
 * type of the archive file:
 * * `application/zip` for a **.zip** file
 * * `application/gzip` for a **.tar.gz** file.
 *
 * All audio files contained in the archive must have the same audio format. Use the `Contained-Content-Type` parameter
 * to specify the format of the contained audio files. The parameter accepts all of the audio formats supported for use
 * with speech recognition and with the `Content-Type` header, including the `rate`, `channels`, and `endianness`
 * parameters that are used with some formats. The default contained audio format is `audio/wav`.
 *
 * @param {Object} params - The parameters to send to the service.
 * @param {string} [params.username] - The username used to authenticate with the service. Username and password credentials are only required to run your application locally or outside of Bluemix. When running on Bluemix, the credentials will be automatically loaded from the `VCAP_SERVICES` environment variable.
 * @param {string} [params.password] - The password used to authenticate with the service. Username and password credentials are only required to run your application locally or outside of Bluemix. When running on Bluemix, the credentials will be automatically loaded from the `VCAP_SERVICES` environment variable.
 * @param {string} [params.iam_access_token] - An IAM access token fully managed by the application. Responsibility falls on the application to refresh the token, either before it expires or reactively upon receiving a 401 from the service, as any requests made with an expired token will fail.
 * @param {string} [params.iam_apikey] - An API key that can be used to request IAM tokens. If this API key is provided, the SDK will manage the token and handle the refreshing.
 * @param {string} [params.iam_url] - An optional URL for the IAM service API. Defaults to 'https://iam.bluemix.net/identity/token'.
 * @param {Object} [params.headers] - Custom HTTP request headers
 * @param {boolean} [params.headers.X-Watson-Learning-Opt-Out=false] - opt-out of data collection
 * @param {string} [params.url] - override default service base url
 * @param {string} params.customization_id - The customization ID (GUID) of the custom acoustic model. You must make the
 * request with service credentials created for the instance of the service that owns the custom model.
 * @param {string} params.audio_name - The name of the audio resource for the custom acoustic model. When adding an
 * audio resource, do not include spaces in the name; use a localized name that matches the language of the custom
 * model.
 * @param {ReadableStream|FileObject|Buffer} params.audio_resource - The audio resource that is to be added to the
 * custom acoustic model, an individual audio file or an archive file.
 * @param {string} params.content_type - The type of the input.
 * @param {string} [params.contained_content_type] - For an archive-type resource, specifies the format of the audio
 * files contained in the archive file. The parameter accepts all of the audio formats supported for use with speech
 * recognition, including the `rate`, `channels`, and `endianness` parameters that are used with some formats. For a
 * complete list of supported audio formats, see [Audio formats](/docs/services/speech-to-text/input.html#formats).
 * @param {boolean} [params.allow_overwrite] - If `true`, the specified corpus or audio resource overwrites an existing
 * corpus or audio resource with the same name. If `false`, the request fails if a corpus or audio resource with the
 * same name already exists. The parameter has no effect if a corpus or audio resource with the same name does not
 * already exist.
 * @return {Promise} - The Promise that the action returns.
 */
function main(params) {
  return new Promise((resolve, reject) => {
    const _params = getParams(
      params,
      'speech-to-text',
      'speech_to_text',
    );
    _params.headers = extend(
      {},
      _params.headers,
      { 'User-Agent': 'openwhisk' }
    );
    let service;
    try {
      service = new SpeechToTextV1(_params);
      service.addAudio(_params, (err, response) => {
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
* @param {string} service - name of service in bluemix used to retrieve credentials, used for IAM instances
* @param {string} serviceAltName - alternate name of service used for cloud foundry instances
*/
function getParams(theParams, service, serviceAltName) {
  if (Object.keys(theParams).length === 0) {
    return theParams;
  }
  let bxCreds;
  // Code that checks parameters bound using service bind
  if (theParams.__bx_creds) {
    // If user has IAM instance of service
    if (theParams.__bx_creds[service]) {
      bxCreds = theParams.__bx_creds[service];
    } else if (theParams.__bx_creds[serviceAltName]) {
      // If user has no IAM instance of service, check for CF instances
      bxCreds = theParams.__bx_creds[serviceAltName];
    } else {
      // User has no instances of service
      bxCreds = {};
    }
  } else {
    bxCreds = {};
  }
  const _params = Object.assign({}, bxCreds, theParams);
  if (_params.apikey) {
    _params.iam_apikey = _params.apikey;
    delete _params.apikey;
  }
  delete _params.__bx_creds;
  return _params;
}

global.main = main;
module.exports.test = main;
