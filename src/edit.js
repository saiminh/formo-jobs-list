import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import Jobs from './jobs';
import './editor.scss';


export default function Edit() {
  // const res = await fetch('https://formo.recruitee.com/api/offers/');

  return (
		<Jobs />
	);
}
