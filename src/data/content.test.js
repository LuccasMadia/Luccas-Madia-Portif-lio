import { about, services, projects, skills, socials } from './content';

describe('content data', () => {
  it('exports a well-formed about object', () => {
    expect(about).toMatchObject({
      name: expect.any(String),
      role: expect.any(String),
      tagline: expect.any(String),
      bio: expect.any(String),
      yearsExperience: expect.any(Number),
      projectsDelivered: expect.any(Number),
    });
  });

  it('exports non-empty services with required fields', () => {
    expect(services.length).toBeGreaterThan(0);
    services.forEach((service) => {
      expect(service).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        icon: expect.any(String),
      });
    });
  });

  it('exports non-empty projects with a stack array', () => {
    expect(projects.length).toBeGreaterThan(0);
    projects.forEach((project) => {
      expect(project).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        codeUrl: expect.any(String),
      });
      expect(Array.isArray(project.stack)).toBe(true);
      expect(project.stack.length).toBeGreaterThan(0);
    });
  });

  it('first project includes a screenshot gallery', () => {
    expect(Array.isArray(projects[0].images)).toBe(true);
    expect(projects[0].images.length).toBeGreaterThan(0);
  });

  it('exports non-empty skill categories with items', () => {
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((group) => {
      expect(group.category).toEqual(expect.any(String));
      expect(group.items.length).toBeGreaterThan(0);
      group.items.forEach((item) => {
        expect(item).toMatchObject({ name: expect.any(String), icon: expect.any(String) });
      });
    });
  });

  it('exports all three social links', () => {
    expect(socials).toMatchObject({
      whatsapp: expect.any(String),
      linkedin: expect.any(String),
      github: expect.any(String),
    });
  });
});
