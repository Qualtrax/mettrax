import { InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from '../fragmentTypes.json';
import { HttpLink } from 'apollo-link-http';

export default function(context){
	const fragmentMatcher = new IntrospectionFragmentMatcher({
	  introspectionQueryResultData
	});

  return {
		httpEndpoint: 'https://api.github.com/graphql',
		getAuth:() => 'Bearer 2a6500d29e5f3f6e76a02cb8eb75e6ca2e9df808',
    cache: new InMemoryCache({ fragmentMatcher })
  }
}
