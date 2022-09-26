// import { ref } from 'vue'
import axios, { AxiosInstance, type AxiosResponse } from 'axios'
// import { useFontStore } from '../stores/font'

export default function useSpellCheck() {
  const callApi = (contentToCheck: string) => {
    const options = {
      method: 'POST',
      url: 'https://jspell-checker.p.rapidapi.com/check',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_API_PRIVATE_KEY,
        'X-RapidAPI-Host': 'jspell-checker.p.rapidapi.com',
      },
      data: `{
        "language":"enUS",
        "fieldvalues":"${contentToCheck}",
        "config":{
            "forceUpperCase":false,
            "ignoreIrregularCaps":false,
            "ignoreFirstCaps":true,
            "ignoreNumbers":true,
            "ignoreUpper":false,
            "ignoreDouble":false,
            "ignoreWordsWithNumbers":true
        }}`,
    }
    return axios
      .request(options)
      .then(function (response: AxiosResponse) {
        return response.data
      })
      .catch(function (error: Error) {
        console.error(error)
      })
  }

  return {
    callApi,
  }
}
