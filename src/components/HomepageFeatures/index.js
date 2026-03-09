
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

const FeatureList = [
  {
    title: 'AI-Driven Weekly Rewards',
    img: '/img/feature_tax_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        Every week, Miko's AI analyzes the Solana ecosystem, selects an optimal reward token, and distributes it directly to eligible holders — automatically.
      </>
    ),
  },
  {
    title: 'Fact-Checked, Self-Improving AI',
    img: '/img/feature_ai_miko.png', // Placeholder path for Miko's image
    description: (
      <>
        A multi-source verification pipeline ensures decisions are grounded in verified data. A 3-phase ML system evolves with every selection, getting sharper over time.
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
