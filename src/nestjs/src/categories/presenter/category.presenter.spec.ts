import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from './category.presenter';

describe('CategoryPresenter Unit Test', () => {
  describe('Constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'c7de2933-09e3-4adc-a0b9-dd1a897c67d5',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });

      expect(presenter.id).toBe('c7de2933-09e3-4adc-a0b9-dd1a897c67d5');
      expect(presenter.name).toBe('movie');
      expect(presenter.description).toBe('some description');
      expect(presenter.is_active).toBeTruthy();
      expect(presenter.created_at).toBe(created_at);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'c7de2933-09e3-4adc-a0b9-dd1a897c67d5',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });
      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: 'c7de2933-09e3-4adc-a0b9-dd1a897c67d5',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at: created_at.toISOString(),
      });
    });
  });
});
