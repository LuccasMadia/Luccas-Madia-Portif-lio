import { iconMap } from './icons';

describe('iconMap', () => {
  it('maps every content icon key to a component', () => {
    const keys = [
      'FaCode',
      'FaChartLine',
      'FaRobot',
      'FaClipboardList',
      'FaReact',
      'FaNodeJs',
      'FaJs',
      'FaTasks',
      'FaFileExcel',
      'FaGitAlt',
      'FaFigma',
      'FaMapMarkerAlt',
      'MdNfc',
    ];

    keys.forEach((key) => {
      expect(typeof iconMap[key]).toBe('function');
    });
  });
});
