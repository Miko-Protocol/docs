
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

const FeatureList = [
  {
    title: 'Synergy of AI and Tokenomics',
    img: '/img/feature_ai_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        An AI agent analyzes crypto social sentiment to select weekly reward tokens, 
        creating a feedback loop between community trends and holder rewards.
      </>
    ),
  },
  {
    title: 'Sustainable Funding Through Taxation',
    img: '/img/feature_tax_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        A permanent 6% fee on all MIKO token transactions provides a continuous
        stream of funding for rewards and development, powering the ecosystem.
      </>
    ),
  },
  {
    title: 'Community Engagement via AI Persona',
    img: '/img/feature_community_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        The 'Miko' AI agent acts as a public-facing persona on X (Twitter), 
        sharing insights, memes, and reward announcements to engage the community.
      </>
    ),
  },
];

function Feature({img, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureImg} src={useBaseUrl(img)} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
