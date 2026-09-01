
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

const FeatureList = [
  {
    title: 'AI-Curated Allocation at Two Speeds',
    img: '/img/feature_tax_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        Every week, Miko's AI Selects the core asset, while a satellite sleeve tracks the market's attention leader. Both are allocated pro-rata to eligible holders.
      </>
    ),
  },
  {
    title: 'Fact-Checked, Self-Improving AI',
    img: '/img/feature_ai_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        Every decision is grounded in two verified evidence axes — fact-checked attention and receipt-verified wallet capital — sharpened by a live model tournament.
      </>
    ),
  },
  {
    title: 'Community Engagement via AI Persona',
    img: '/img/feature_community_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        The 'Miko' AI agent acts as a public-facing persona on X (Twitter), sharing insights, memes, and reward announcements to engage the community.
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
